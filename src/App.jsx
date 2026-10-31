import { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";
import { Settings, LogOut, UserRound, ShieldCheck } from "lucide-react";
import Sidebar from "./components/Sidebar.jsx";
import Topbar from "./components/Topbar.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import RoomsPage from "./pages/RoomsPage.jsx";
import BookingsPage from "./pages/BookingsPage.jsx";
import AssistantWidget from "./components/AssistantWidget.jsx";
import { initialRooms, initialBookings } from "./data/mockData.jsx";

const readStore=(key,fallback)=>{try{const value=localStorage.getItem(key);return value?JSON.parse(value):fallback;}catch{return fallback;}};
export default function App(){
 const [user,setUser]=useState(()=>readStore("roomsync_user",null));
 const [rooms,setRooms]=useState(()=>readStore("roomsync_rooms",initialRooms));
 const [bookings,setBookings]=useState(()=>readStore("roomsync_bookings",initialBookings));
 const [users,setUsers]=useState(()=>readStore("roomsync_users",[
  {name:"Aarav Sharma",email:"student@roomsync.demo",password:"demo123",role:"student"},
  {name:"Campus Admin",email:"admin@roomsync.demo",password:"demo123",role:"admin"}
 ]));
 const [page,setPage]=useState(user?.role==="admin"?"overview":"discover");
 const [mobileOpen,setMobileOpen]=useState(false);
 const [assistantOpen,setAssistantOpen]=useState(false);
 useEffect(()=>localStorage.setItem("roomsync_user",JSON.stringify(user)),[user]);
 useEffect(()=>localStorage.setItem("roomsync_rooms",JSON.stringify(rooms)),[rooms]);
 useEffect(()=>localStorage.setItem("roomsync_bookings",JSON.stringify(bookings)),[bookings]);
 useEffect(()=>localStorage.setItem("roomsync_users",JSON.stringify(users)),[users]);
 const login=({email,password,role})=>{
  const found=users.find(u=>u.email.toLowerCase()===email.toLowerCase()&&u.password===password&&u.role===role);
  if(!found)return {error:"We couldn't find an account with those details and account type."};
  setUser({name:found.name,email:found.email,role:found.role});setPage(found.role==="admin"?"overview":"discover");toast.success(`Welcome back, ${found.name.split(" ")[0]}!`);return {};
 };
 const register=({name,email,password,role})=>{
  if(users.some(u=>u.email.toLowerCase()===email.toLowerCase()))return {error:"An account with this email already exists."};
  const next={name,email,password,role};setUsers(old=>[...old,next]);setUser({name,email,role});setPage(role==="admin"?"overview":"discover");toast.success("Your RoomSync account has been created.");return {};
 };
 const logout=()=>{setUser(null);setPage("discover");toast("You have signed out.");};
 const createBooking=(room,filters)=>{
  if(!user){toast.error("Please sign in to book a room.");return;}
  const start=filters.start,end=filters.end,date=filters.date;
  if(!date||!start||!end||start>=end){toast.error("Please choose a valid date and time.");return;}
  if(room.capacity<Number(filters.group)){toast.error("This room does not have enough seats.");return;}
  if(!room.allowed_purposes.includes(filters.purpose)){toast.error("This room is not approved for that purpose.");return;}
  if(!filters.facilities.every(f=>room.facilities.includes(f))){toast.error("This room is missing a required facility.");return;}
  const overlap=(a,b,c,d)=>a<d&&b>c;
  const scheduleConflict=room.schedule?.some(s=>s.date===date&&overlap(start,end,s.start,s.end));
  const bookingConflict=bookings.some(b=>b.roomId===room.id&&b.date===date&&["Confirmed","Pending"].includes(b.status)&&overlap(start,end,b.start,b.end));
  if(scheduleConflict||bookingConflict){toast.error("This room is no longer available for that time. Try another room or slot.");return;}
  const booking={id:`RS-${Date.now().toString().slice(-6)}`,roomId:room.id,room:room.name,code:room.code,date,start,end,purpose:filters.purpose,group:Number(filters.group),status:"Confirmed",student:user.name};
  setBookings(old=>[booking,...old]);toast.success("Room booked successfully!",{description:`${room.name} · ${date} · ${start}–${end}`});
 };
 const updateStatus=(id,status)=>{
  const target=bookings.find(b=>b.id===id);
  if(status==="Confirmed"&&target){
   const overlap=(a,b,c,d)=>a<d&&b>c;
   const conflict=bookings.some(b=>b.id!==id&&b.roomId===target.roomId&&b.date===target.date&&b.status==="Confirmed"&&overlap(target.start,target.end,b.start,b.end));
   if(conflict){toast.error("Cannot approve: this room has an overlapping confirmed booking.");return;}
  }
  setBookings(old=>old.map(b=>b.id===id?{...b,status}:b));toast.success(`Reservation ${status.toLowerCase()}.`);
 };
 const addRoom=room=>{setRooms(old=>[...old,{...room,id:Math.max(0,...old.map(r=>r.id))+1}]);toast.success("Room added to the campus directory.");};
 if(!user)return <><AuthPage onLogin={login} onRegister={register}/><Toaster position="top-right" richColors/></>;
 let content;
 if(user.role==="student"&&page==="discover")content=<StudentDashboard rooms={rooms} bookings={bookings} onBook={createBooking} user={user}/>;
 else if(user.role==="admin"&&(page==="overview"||page==="analytics"))content=<AdminDashboard rooms={rooms} bookings={bookings} onStatusChange={updateStatus} setPage={setPage}/>;
 else if(page==="rooms")content=<RoomsPage rooms={rooms} onBook={room=>createBooking(room,{date:new Date().toISOString().slice(0,10),start:"14:00",end:"16:00",group:"2",purpose:room.allowed_purposes[0],facilities:[]})} onAddRoom={addRoom}/>;
 else if(page==="settings")content=<div className="page-content"><div className="page-title-row"><div><span className="eyebrow">PREFERENCES</span><h1>Settings</h1><p>Manage your local demo profile and workspace.</p></div></div><section className="panel settings-panel"><div className="settings-profile"><div className="avatar">{user.name.split(" ").map(x=>x[0]).slice(0,2).join("")}</div><div><strong>{user.name}</strong><span>{user.email}</span></div></div><div className="detail-list"><div><span>Account type</span><strong>{user.role==="admin"?"Administrator":"Student"}</strong></div><div><span>Data storage</span><strong>This browser (local demo)</strong></div><div><span>Prototype version</span><strong>RoomSync MVP</strong></div></div><button className="button button-secondary" onClick={logout}><LogOut size={16}/> Sign out</button></section></div>;
 else content=<BookingsPage bookings={bookings} onStatusChange={updateStatus} role={user.role} user={user}/>;
 return <div className="app-shell"><Sidebar role={user.role} user={user} onOpenAssistant={()=>setAssistantOpen(true)} page={page} setPage={setPage} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} setRole={r=>{setUser(old=>({...old,role:r}));setPage(r==="admin"?"overview":"discover");}} onLogout={logout}/><main className="main-area"><Topbar role={user.role} setMobileOpen={setMobileOpen} user={user} onLogout={logout}/><div className="demo-strip"><ShieldCheck size={14}/><span>Interactive prototype · Changes are saved in this browser.</span><button onClick={()=>setPage(user.role==="admin"?"overview":"discover")}>Go to dashboard ↗</button></div>{content}<footer className="app-footer"><span>© 2026 RoomSync. Built for better campus collaboration.</span><span><i/> Demo workspace active</span></footer></main><AssistantWidget open={assistantOpen} setOpen={setAssistantOpen} role={user.role} rooms={rooms} bookings={bookings} user={user}/><Toaster position="top-right" richColors closeButton/></div>;
}
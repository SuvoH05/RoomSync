import { useMemo, useState } from "react";
import { Bot, X, Send, Sparkles, CalendarDays, Search, DoorOpen, RotateCcw } from "lucide-react";

const starterPrompts=[
 "How do I book a room?",
 "Find a room for my group",
 "How do I cancel a booking?",
 "What can administrators do?"
];

function answerFor(question,{role,rooms,bookings,user}){
 const q=question.toLowerCase();
 if(q.includes("book")||q.includes("reserv")){
  if(q.includes("cancel"))return "Open “My bookings” from the sidebar, find the reservation and review its details. In this demo, cancellation is currently handled by an administrator from the Reservations page. For a production release, add a student cancellation action with a cancellation policy.";
  if(q.includes("how"))return "To book: open Discover rooms, choose your date, start time, duration, group size, purpose and any required facilities, then select Find a room. Choose an available result and press Book room. RoomSync checks for overlapping bookings before confirming.";
  return `There are ${rooms.length} rooms in the campus directory and ${bookings.filter(b=>b.status==="Confirmed").length} confirmed reservations. Use Discover rooms to filter by date, time, group size, purpose and facilities.`;
 }
 if(q.includes("room")||q.includes("space")||q.includes("available")){
  const available=rooms.filter(r=>r.available);
  return `The directory currently has ${available.length} rooms marked available: ${available.map(r=>`${r.name} (${r.code}, capacity ${r.capacity})`).join("; ")}. Availability for a specific time is checked on the Discover rooms screen, including existing bookings and timetable blocks.`;
 }
 if(q.includes("admin")||q.includes("approve")||q.includes("manage")){
  return "Administrators can review the Overview dashboard, add rooms in Room management, and approve or reject pending requests in Reservations. The Analytics page summarizes room utilization. Use the account role switch only for this local demo; production role permissions must be enforced by the backend.";
 }
 if(q.includes("facility")||q.includes("filter")||q.includes("search")){
  return "Use the Discover rooms filters: date, start time, duration, group size, purpose and facilities such as projector, whiteboard, AC, computers or audio. The result list filters rooms by capacity, permitted purpose, facilities and time conflicts.";
 }
 if(q.includes("hello")||q.includes("hi")||q.includes("hey")){
  return `Hi ${user?.name?.split(" ")[0]||"there"}! I'm the RoomSync assistant. I can help with room discovery, booking steps, availability checks and admin workflows. What would you like to know?`;
 }
 if(q.includes("help")||q.includes("what can")){
  return "I can explain how to find a suitable room, how booking and conflict checks work, what facilities filters do, and how administrators manage requests and rooms. Try one of the suggested questions below.";
 }
 return "I can help with RoomSync room discovery, booking steps, time-slot conflicts, facilities filters and administrator workflows. Try asking “How do I book a room?” or “Find a room for my group”.";
}

export default function AssistantWidget({open,setOpen,role,rooms,bookings,user}){
 const [messages,setMessages]=useState([{from:"assistant",text:`Hello ${user?.name?.split(" ")[0]||"there"}! 👋 I'm your RoomSync assistant. Ask me anything about finding spaces, making bookings or managing reservations.`}]);
 const [draft,setDraft]=useState("");
 const suggestions=useMemo(()=>starterPrompts,[ ]);
 const send=(value=draft)=>{
  const question=value.trim();if(!question)return;
  const response=answerFor(question,{role,rooms,bookings,user});
  setMessages(old=>[...old,{from:"user",text:question},{from:"assistant",text:response}]);setDraft("");
 };
 const reset=()=>setMessages([{from:"assistant",text:`Hi ${user?.name?.split(" ")[0]||"there"}! What can I help you with today?`}]);
 return <>
  <button className="assistant-fab" onClick={()=>setOpen(v=>!v)} aria-label="Open RoomSync AI assistant"><Bot size={21}/><span>Ask AI</span></button>
  {open&&<section className="assistant-window" aria-label="RoomSync AI assistant">
   <header className="assistant-header"><div className="assistant-avatar"><Bot size={19}/></div><div className="assistant-header-copy"><strong>RoomSync Assistant</strong><span><i/> Here to help · Demo AI</span></div><button className="assistant-head-action" title="New conversation" onClick={reset}><RotateCcw size={15}/></button><button className="assistant-head-action" title="Close assistant" onClick={()=>setOpen(false)}><X size={18}/></button></header>
   <div className="assistant-messages">
    <div className="assistant-context"><Sparkles size={13}/> Answers based on the current RoomSync demo</div>
    {messages.map((m,i)=><div key={i} className={`chat-line ${m.from}`}><div className="chat-bubble">{m.text}</div></div>)}
    {messages.length===1&&<div className="assistant-suggestions">{suggestions.map(s=><button key={s} onClick={()=>send(s)}>{s}<span>↗</span></button>)}</div>}
   </div>
   <form className="assistant-compose" onSubmit={e=>{e.preventDefault();send();}}><input value={draft} onChange={e=>setDraft(e.target.value)} placeholder="Ask about rooms or bookings..." aria-label="Message the assistant"/><button type="submit" disabled={!draft.trim()} aria-label="Send message"><Send size={17}/></button></form>
   <div className="assistant-footnote">AI demo · No external AI service connected</div>
  </section>}
 </>;
}
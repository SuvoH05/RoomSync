export const initialRooms = [
 {id:1,name:"Innovation Studio",code:"A-204",building:"Academic Block A",capacity:24,type:"Collaboration",floor:"2nd Floor",facilities:["Projector","Whiteboard","AC"],allowed_purposes:["Project work","Group study","Team meeting","Presentation"],image:"https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900&q=85",available:true,score:98,schedule:[{date:"2026-10-31",start:"10:00",end:"12:00"}]},
 {id:2,name:"Seminar Room",code:"B-108",building:"Academic Block B",capacity:40,type:"Seminar",floor:"1st Floor",facilities:["Projector","Audio","AC"],allowed_purposes:["Presentation","Team meeting","Project work"],image:"https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=900&q=85",available:true,score:94,schedule:[]},
 {id:3,name:"Focus Room",code:"C-301",building:"Library Wing",capacity:10,type:"Study",floor:"3rd Floor",facilities:["Whiteboard","AC"],allowed_purposes:["Group study","Project work"],image:"https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&q=85",available:true,score:91,schedule:[]},
 {id:4,name:"Project Lab",code:"A-110",building:"Academic Block A",capacity:18,type:"Lab",floor:"1st Floor",facilities:["Projector","Computers","AC"],allowed_purposes:["Project work","Presentation"],image:"https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900&q=85",available:true,score:86,schedule:[{date:"2026-10-31",start:"14:00",end:"16:00"}]}
];
export const initialBookings=[
 {id:"RS-1042",roomId:1,room:"Innovation Studio",code:"A-204",date:"2026-10-31",start:"14:00",end:"16:00",purpose:"Project work",group:8,status:"Confirmed",student:"Aarav Sharma"},
 {id:"RS-1041",roomId:2,room:"Seminar Room",code:"B-108",date:"2026-10-31",start:"10:00",end:"11:30",purpose:"Team meeting",group:12,status:"Pending",student:"Diya Patel"},
 {id:"RS-1039",roomId:3,room:"Focus Room",code:"C-301",date:"2026-11-01",start:"12:00",end:"13:00",purpose:"Group study",group:5,status:"Confirmed",student:"Kabir Das"},
 {id:"RS-1038",roomId:4,room:"Project Lab",code:"A-110",date:"2026-10-30",start:"15:00",end:"17:00",purpose:"Project work",group:10,status:"Cancelled",student:"Mira Sen"}
];
export const weeklyUsage=[{day:"Mon",usage:48},{day:"Tue",usage:66},{day:"Wed",usage:58},{day:"Thu",usage:82},{day:"Fri",usage:72},{day:"Sat",usage:38},{day:"Sun",usage:22}];
export const roomUsage=[{name:"Innovation Studio",usage:86},{name:"Seminar Room",usage:72},{name:"Focus Room",usage:64},{name:"Project Lab",usage:51}];
import { Search, SlidersHorizontal, RotateCcw } from "lucide-react";

const times = Array.from({length: 13}, (_, i) => `${String(i+8).padStart(2,"0")}:00`);
export const defaultFilters = () => ({ date: new Date().toISOString().slice(0,10), start: "14:00", duration: "2", group: "8", purpose: "Project work", facilities: [] });

export default function SearchPanel({ filters, setFilters, onSearch, onReset }) {
  const update = (key, value) => setFilters(old => ({ ...old, [key]: value }));
  return (
    <section className="search-panel">
      <div className="search-panel-heading"><div><span className="eyebrow">FIND YOUR SPACE</span><h2>What kind of space do you need?</h2><p>Set your requirements and we'll find rooms that fit.</p></div><div className="filter-mark"><SlidersHorizontal size={19}/></div></div>
      <div className="search-fields">
        <label className="field"><span>Date</span><input type="date" min={new Date().toISOString().slice(0,10)} value={filters.date} onChange={e=>update("date",e.target.value)}/></label>
        <label className="field"><span>Start time</span><select value={filters.start} onChange={e=>update("start",e.target.value)}>{times.map(t=><option key={t} value={t}>{t}</option>)}</select></label>
        <label className="field"><span>Duration</span><select value={filters.duration} onChange={e=>update("duration",e.target.value)}>{[1,2,3,4].map(n=><option key={n} value={n}>{n} {n===1?"hour":"hours"}</option>)}</select></label>
        <label className="field"><span>Group size</span><input type="number" min="1" max="100" value={filters.group} onChange={e=>update("group",e.target.value)}/></label>
        <button className="button button-primary search-submit" onClick={onSearch}><Search size={17}/> Find a room</button>
      </div>
      <div className="search-extra"><span>Purpose</span>{["Project work","Group study","Team meeting","Presentation"].map(p=><button type="button" key={p} className={`choice-chip ${filters.purpose===p?"selected":""}`} onClick={()=>update("purpose",p)}>{p}</button>)}</div>
      <div className="search-extra facilities-row"><span>Facilities</span>{["Projector","Whiteboard","AC","Computers","Audio"].map(f=><label className="check-chip" key={f}><input type="checkbox" checked={filters.facilities.includes(f)} onChange={e=>update("facilities",e.target.checked?[...filters.facilities,f]:filters.facilities.filter(x=>x!==f))}/>{f}</label>)}<button className="reset-filters" onClick={onReset}><RotateCcw size={12}/> Reset</button></div>
    </section>
  );
}
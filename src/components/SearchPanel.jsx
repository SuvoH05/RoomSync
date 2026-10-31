import { Search, SlidersHorizontal } from "lucide-react";

export default function SearchPanel({ filters, setFilters, onSearch }) {
  const update = (key, value) => setFilters((old) => ({ ...old, [key]: value }));
  return (
    <section className="search-panel">
      <div className="search-panel-heading"><div><span className="eyebrow">FIND YOUR SPACE</span><h2>What kind of space do you need?</h2><p>Tell us what you're planning. We'll find the right room.</p></div><div className="filter-mark"><SlidersHorizontal size={19}/></div></div>
      <div className="search-fields">
        <label className="field"><span>Date</span><input type="date" value={filters.date} onChange={e => update("date", e.target.value)}/></label>
        <label className="field"><span>Start time</span><select value={filters.start} onChange={e => update("start", e.target.value)}><option value="09:00">09:00 AM</option><option value="10:00">10:00 AM</option><option value="12:00">12:00 PM</option><option value="14:00">02:00 PM</option><option value="15:00">03:00 PM</option><option value="16:00">04:00 PM</option></select></label>
        <label className="field"><span>Duration</span><select value={filters.duration} onChange={e => update("duration", e.target.value)}><option value="1">1 hour</option><option value="2">2 hours</option><option value="3">3 hours</option></select></label>
        <label className="field"><span>Group size</span><input type="number" min="1" max="100" value={filters.group} onChange={e => update("group", e.target.value)}/></label>
        <button className="button button-primary search-submit" onClick={onSearch}><Search size={17}/> Find a room</button>
      </div>
      <div className="search-extra"><span>Purpose</span>{["Project work", "Group study", "Team meeting", "Presentation"].map(p => <button key={p} className={`choice-chip ${filters.purpose === p ? "selected" : ""}`} onClick={() => update("purpose", p)}>{p}</button>)}</div>
      <div className="search-extra facilities-row"><span>Need</span>{["Projector", "Whiteboard", "AC"].map(f => <label className="check-chip" key={f}><input type="checkbox" checked={filters.facilities.includes(f)} onChange={e => update("facilities", e.target.checked ? [...filters.facilities, f] : filters.facilities.filter(x => x !== f))}/>{f}</label>)}</div>
    </section>
  );
}
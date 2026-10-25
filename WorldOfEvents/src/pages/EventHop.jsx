import { useMemo, useState } from "react";
import { ArrowRight, Clock3, MapPin, Navigation, Route, ShieldAlert, Timer, TrainFront } from "lucide-react";
import { Link } from "react-router-dom";
import { events, formatDate } from "../data/events.js";

const pilotArea = "Bandra, Mumbai";
const asMinutes = (time) => { const [h,m] = time.split(":").map(Number); return h*60+m; };
const timeLabel = (mins) => `${String(Math.floor(((mins % 1440)+1440)%1440/60)).padStart(2,"0")}:${String(((mins%60)+60)%60).padStart(2,"0")}`;
const mapsSearch = (query) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
const mapsDirections = (from,to) => `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(from)}&destination=${encodeURIComponent(to)}&travelmode=driving`;

export default function EventHop(){
  const pilotEvents = useMemo(() => events.filter(e => e.area?.includes("Bandra")), []);
  const sameDay = pilotEvents.filter(e => e.date === "2026-11-05");
  const [fromId,setFromId] = useState(sameDay.find(e=>e.id==="design-meetup")?.id || pilotEvents[0]?.id || "");
  const [toId,setToId] = useState(sameDay.find(e=>e.id==="ai-product")?.id || pilotEvents[1]?.id || pilotEvents[0]?.id || "");
  const [walk,setWalk] = useState(8);
  const [ride,setRide] = useState(22);
  const [buffer,setBuffer] = useState(10);
  const from = pilotEvents.find(e=>e.id===fromId);
  const to = pilotEvents.find(e=>e.id===toId);
  const sameDate = Boolean(from && to && from.date===to.date);
  const gap = from && to ? asMinutes(to.start) - asMinutes(from.end) : 0;
  const total = Number(walk)+Number(ride)+Number(buffer);
  const slack = gap-total;
  const valid = from && to && from.id!==to.id && sameDate && gap>0;
  const pickupQuery = from ? `taxi stand OR designated taxi pickup near ${from.venue}, ${from.area}` : `taxi stand ${pilotArea}`;
  return <div className="page-shell eventhop-page">
    <div className="page-title">
      <span className="eyebrow purple"><Route size={14}/> EVENT HOP · LOCAL PILOT</span>
      <h1>Make it to your next event.</h1>
      <p>Plan the gap between two events in <strong>{pilotArea}</strong> — including where to look for a pickup and whether your timing is realistic.</p>
    </div>
    <div className="eventhop-banner">
      <div className="eventhop-banner-icon"><Navigation size={24}/></div>
      <div><strong>One day. More than one experience.</strong><p>Event Hop connects your itinerary to practical travel planning. No ride booking, live taxi tracking, or live traffic data is claimed in this pilot.</p></div>
    </div>

    <section className="eventhop-grid">
      <div className="panel eventhop-form">
        <div className="eventhop-section-title"><span className="eventhop-number">01</span><div><h2>Your itinerary</h2><p>Choose two events in the pilot area.</p></div></div>
        <label className="eventhop-label" htmlFor="eventhop-from">First event</label>
        <select id="eventhop-from" value={fromId} onChange={e=>setFromId(e.target.value)}>
          {pilotEvents.map(e=><option key={e.id} value={e.id}>{e.title} · {e.start}–{e.end}</option>)}
        </select>
        {from && <div className="eventhop-venue"><MapPin size={16}/><div><strong>{from.venue}</strong><span>{formatDate(from.date)} · {from.area}</span></div><a href={mapsSearch(`${from.venue}, ${from.area}`)} target="_blank" rel="noreferrer">Open map ↗</a></div>}
        <div className="eventhop-arrow"><ArrowRight size={18}/><span>Travel between events</span></div>
        <label className="eventhop-label" htmlFor="eventhop-to">Next event</label>
        <select id="eventhop-to" value={toId} onChange={e=>setToId(e.target.value)}>
          {pilotEvents.map(e=><option key={e.id} value={e.id}>{e.title} · {e.start}–{e.end}</option>)}
        </select>
        {to && <div className="eventhop-venue"><MapPin size={16}/><div><strong>{to.venue}</strong><span>{formatDate(to.date)} · {to.area}</span></div><a href={mapsSearch(`${to.venue}, ${to.area}`)} target="_blank" rel="noreferrer">Open map ↗</a></div>}
        <div className="eventhop-section-title eventhop-travel-heading"><span className="eventhop-number">02</span><div><h2>Travel assumptions</h2><p>Adjust these estimates for your route.</p></div></div>
        <div className="eventhop-number-fields">
          <label>Walk to pickup <span>minutes</span><input type="number" min="0" max="90" value={walk} onChange={e=>setWalk(Math.max(0,Math.min(90,Number(e.target.value)||0)))}/></label>
          <label>Taxi journey <span>minutes</span><input type="number" min="0" max="240" value={ride} onChange={e=>setRide(Math.max(0,Math.min(240,Number(e.target.value)||0)))}/></label>
          <label>Extra buffer <span>minutes</span><input type="number" min="0" max="90" value={buffer} onChange={e=>setBuffer(Math.max(0,Math.min(90,Number(e.target.value)||0)))}/></label>
        </div>
        <p className="eventhop-hint"><Clock3 size={14}/> Estimates are editable planning inputs, not live traffic or guaranteed journey times. Check a navigation app before leaving.</p>
      </div>

      <aside className="eventhop-results">
        <div className="panel eventhop-verdict">
          <span className="eyebrow purple">YOUR TIME CHECK</span>
          {!from || !to ? <h2>Select two events</h2> : from.id===to.id ? <><h2>Choose a different next event</h2><p>Pick two distinct events to calculate your transfer window.</p></> : !sameDate ? <><h2>These events are on different days</h2><p>Choose events on the same date to check whether the transfer fits.</p></> : gap<=0 ? <><h2>No transfer window</h2><p>The next event starts before the first event ends. Choose another event or check the schedule.</p></> : <>
            <div className={`eventhop-status ${slack>=0?"is-feasible":"is-tight"}`}>{slack>=0 ? "Potentially feasible" : "Likely too tight"}</div>
            <h2>{slack>=0 ? `${slack} min to spare` : `${Math.abs(slack)} min short`}</h2>
            <p>{slack>=0 ? "Your estimated travel time fits inside the gap, with the selected buffer." : "Your estimates exceed the time between events. Consider leaving earlier, changing transport, or choosing a later event."}</p>
            <div className="eventhop-metrics"><div><span>Event ends</span><strong>{from.end}</strong></div><div><span>Next event starts</span><strong>{to.start}</strong></div><div><span>Available gap</span><strong>{gap} min</strong></div><div><span>Estimated transfer</span><strong>{total} min</strong></div></div>
            <div className="eventhop-timeline"><div><span>Leave first venue</span><strong>{timeLabel(asMinutes(from.end))}</strong></div><div><span>Estimated arrival</span><strong>{timeLabel(asMinutes(from.end)+Number(walk)+Number(ride))}</strong></div><div><span>Suggested arrival by</span><strong>{timeLabel(asMinutes(to.start)-Number(buffer))}</strong></div></div>
          </>}
        </div>
        <div className="panel eventhop-pickup">
          <div className="eventhop-section-title"><span className="eventhop-number">03</span><div><h2>Find a pickup point</h2><p>Search around your first venue.</p></div></div>
          <div className="pickup-callout"><MapPin size={20}/><div><strong>Near {from?.venue || "your venue"}</strong><p>Search map listings for taxi stands or designated pickup areas. Verify the location and venue access before relying on it.</p></div></div>
          <a className="button primary full-button" href={mapsSearch(pickupQuery)} target="_blank" rel="noreferrer"><Navigation size={16}/> Search pickup spots in Maps</a>
          {from && to && <a className="button secondary full-button eventhop-directions" href={mapsDirections(`${from.venue}, ${from.area}`,`${to.venue}, ${to.area}`)} target="_blank" rel="noreferrer"><Route size={16}/> Directions to next event</a>}
          <p className="eventhop-disclaimer"><ShieldAlert size={14}/> This pilot does not verify taxi availability or certify a spot as an official stand. Use designated legal pickup areas and follow venue/security instructions.</p>
        </div>
      </aside>
    </section>
    <section className="eventhop-pilot-note"><TrainFront size={19}/><div><strong>Why start in Bandra?</strong><p>This pilot is limited to events tagged Bandra, Mumbai. The included event schedule is sample data. Replace venue details with verified real venues and test pickup results locally before inviting users to rely on the planner.</p></div></section>
    <div className="eventhop-bottom-links"><Link to="/calendar">View event calendar →</Link><Link to="/">Discover more events →</Link></div>
  </div>;
}

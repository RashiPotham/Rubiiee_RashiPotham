import { Link } from "react-router-dom";
import { CalendarDays, MapPin, ArrowUpRight } from "lucide-react";
import { formatDate } from "../data/events.js";
export default function EventCard({ event }) {
  return <article className="event-card"><div className="event-card-top"><span className="tag">{event.category}</span><span className="price">{event.price}</span></div><h3>{event.title}</h3><p>{event.description}</p><div className="event-meta"><span><CalendarDays size={15}/>{formatDate(event.date)} · {event.start}</span><span><MapPin size={15}/>{event.area}</span></div><Link className="inline-link" to={`/events/${event.id}`}>View event <ArrowUpRight size={16}/></Link></article>;
}
import { useState } from "react";
import "./RouteTimeline.css";

interface RouteStop {
  time: string;
  date?: string;
  city: string;
  station: string;
  isStart?: boolean;
  isEnd?: boolean;
}

interface RouteTimelineProps {
  stops: RouteStop[];
  /** Whether to show expand/collapse functionality for intermediate stops */
  showIntermediateStops?: boolean;
}

const RouteTimeline = ({ stops, showIntermediateStops = true }: RouteTimelineProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (stops.length < 2) return null;

  const firstStop = stops[0];
  const lastStop = stops[stops.length - 1];
  const intermediateStops = stops.slice(1, -1);
  const hasIntermediateStops = intermediateStops.length > 0;

  const renderStop = (stop: RouteStop, index: number, isFirst: boolean, isLast: boolean) => (
    <div 
      key={index} 
      className={`route-timeline-stop ${isFirst ? 'route-timeline-stop--first' : ''} ${isLast ? 'route-timeline-stop--last' : ''}`}
    >
      <div className="route-timeline-time">
        <span className="route-timeline-time__value">{stop.time}</span>
        {stop.date && <span className="route-timeline-time__date">{stop.date}</span>}
      </div>
      <div className="route-timeline-indicator">
        <div className={`route-timeline-indicator__circle ${isFirst || isLast ? 'route-timeline-indicator__circle--endpoint' : ''}`} />
        {!isLast && <div className="route-timeline-indicator__line" />}
      </div>
      <div className="route-timeline-info">
        <span className="route-timeline-info__city">{stop.city}</span>
        <span className="route-timeline-info__station">{stop.station}</span>
      </div>
    </div>
  );

  // Collapsed view: only first and last stops
  if (!isExpanded && showIntermediateStops && hasIntermediateStops) {
    return (
      <div className="route-timeline">
        {renderStop(firstStop, 0, true, false)}
        
        {/* Last stop with expand link */}
        <div className="route-timeline-stop route-timeline-stop--last">
          <div className="route-timeline-time">
            <span className="route-timeline-time__value">{lastStop.time}</span>
            {lastStop.date && <span className="route-timeline-time__date">{lastStop.date}</span>}
          </div>
          <div className="route-timeline-indicator">
            <div className="route-timeline-indicator__circle route-timeline-indicator__circle--endpoint" />
          </div>
          <div className="route-timeline-info">
            <span className="route-timeline-info__city">{lastStop.city}</span>
            <span className="route-timeline-info__station">{lastStop.station}</span>
            <button 
              type="button"
              className="route-timeline-toggle"
              onClick={() => setIsExpanded(true)}
            >
              Проміжні пункти ({intermediateStops.length})
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Expanded view: all stops
  return (
    <div className="route-timeline">
      {stops.map((stop, index) => 
        renderStop(stop, index, index === 0, index === stops.length - 1)
      )}
      
      {showIntermediateStops && hasIntermediateStops && (
        <div className="route-timeline-collapse">
          <button 
            type="button"
            className="route-timeline-toggle"
            onClick={() => setIsExpanded(false)}
          >
            Згорнути список
          </button>
        </div>
      )}
    </div>
  );
};

export default RouteTimeline;

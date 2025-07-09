import React from 'react';
import { Link } from 'react-router-dom';
import type { Event } from '../../store/slices/eventsSlice';
import styles from './ScheduleTile.module.css';

interface ScheduleTileProps {
  event: Event;
}

const ScheduleTile: React.FC<ScheduleTileProps> = ({ event }) => {
  const formatDateTime = (dateTime: Date | string) => {
    const date = dateTime instanceof Date ? dateTime : new Date(dateTime);
    return {
      date: date.toLocaleDateString('ko-KR'),
      time: date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const { date, time } = formatDateTime(event.dateTime);

  return (
    <Link to={`/events/${event.id}`} className={styles.scheduleTile}>
      <div className={styles.leftSection}>
        <div className={styles.dateTimeContainer}>
          <div className={styles.date}>{date}</div>
          <div className={styles.time}>{time}</div>
        </div>
      </div>

      <div className={styles.middleSection}>
        <div className={styles.titleRow}>
          <h3 className={styles.title}>{event.subject}</h3>
          <div className={styles.menuBadge}>Menu #{event.menuId}</div>
        </div>
        
        <div className={styles.detailsRow}>
          <span className={styles.place}>
            <span className={styles.icon}>📍</span>
            {event.place}
          </span>
          <span className={styles.participants}>
            <span className={styles.icon}>👥</span>
            최대 {event.maxParticipants}명
          </span>
        </div>

        <div className={styles.content}>
          {event.content.length > 150 ? 
            `${event.content.substring(0, 150)}...` : 
            event.content}
        </div>
      </div>

      <div className={styles.rightSection}>
        <div className={styles.status}>
          <div className={styles.uploadDate}>
            {formatDateTime(event.uploadAt).date}
          </div>
          <div className={styles.state}>{event.status}</div>
        </div>
      </div>
    </Link>
  );
};

export default ScheduleTile; 
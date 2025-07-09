import React from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import UserMenu from '../UserMenu/UserMenu';
import type { Event } from '../../store/slices/eventsSlice';
import styles from './EventList.module.css';

const EventList: React.FC = () => {
  const { events, loading } = useAppSelector((state) => state.events);

  const formatDateTime = (dateTime: Date | string) => {
    const date = dateTime instanceof Date ? dateTime : new Date(dateTime);
    return {
      date: date.toLocaleDateString('ko-KR'),
      time: date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
    };
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1>배드민턴 이벤트</h1>
        </div>
        <div className={styles.headerRight}>
          <Link to="/events/create" className={styles.createBtn}>
            새 이벤트 만들기
          </Link>
          <UserMenu />
        </div>
      </div>

      {events.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📅</div>
          <h2>등록된 이벤트가 없습니다</h2>
          <p>첫 번째 배드민턴 이벤트를 만들어보세요!</p>
          <Link to="/events/create" className={styles.createFirstBtn}>
            첫 이벤트 만들기
          </Link>
        </div>
      ) : (
        <div className={styles.eventGrid}>
          {events.map((event: Event) => {
            const { date, time } = formatDateTime(event.dateTime);
            return (
              <Link 
                key={event.id} 
                to={`/events/${event.id}`} 
                className={styles.eventCard}
              >
                <div className={styles.eventHeader}>
                  <h3 className={styles.eventTitle}>{event.subject}</h3>
                  <div className={styles.eventMenu}>Menu #{event.menuId}</div>
                </div>
                
                <div className={styles.eventDetails}>
                  <div className={styles.eventDetail}>
                    <span className={styles.detailIcon}>📅</span>
                    <span>{date}</span>
                  </div>
                  <div className={styles.eventDetail}>
                    <span className={styles.detailIcon}>⏰</span>
                    <span>{time}</span>
                  </div>
                  <div className={styles.eventDetail}>
                    <span className={styles.detailIcon}>📍</span>
                    <span>{event.place}</span>
                  </div>
                  <div className={styles.eventDetail}>
                    <span className={styles.detailIcon}>👥</span>
                    <span>최대 {event.maxParticipants}명</span>
                  </div>
                </div>
                
                <div className={styles.eventContent}>
                  <p>{event.content.length > 100 ? 
                    `${event.content.substring(0, 100)}...` : 
                    event.content}
                  </p>
                </div>
                
                <div className={styles.eventFooter}>
                  <span className={styles.uploadDate}>
                    {formatDateTime(event.uploadAt).date} 에 생성됨
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EventList; 
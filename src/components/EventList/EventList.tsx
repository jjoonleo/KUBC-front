import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { fetchEvents } from '../../store/slices/eventsSlice';
import UserMenu from '../UserMenu/UserMenu';
import ScheduleTile from './ScheduleTile';
import type { Event } from '../../store/slices/eventsSlice';
import styles from './EventList.module.css';

const EventList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { events, loading, error } = useAppSelector((state) => state.events);

  // Fetch events when component mounts
  useEffect(() => {
    dispatch(fetchEvents({ page: 1, limit: 20 }));
  }, [dispatch]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>오류가 발생했습니다</h2>
          <p>{error}</p>
          <button 
            onClick={() => dispatch(fetchEvents({ page: 1, limit: 20 }))}
            className={styles.retryBtn}
          >
            다시 시도
          </button>
        </div>
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
        <div className={styles.eventList}>
          {events.map((event: Event) => (
            <ScheduleTile key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
};

export default EventList; 
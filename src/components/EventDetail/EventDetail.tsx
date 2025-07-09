import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { setCurrentEvent } from '../../store/slices/eventsSlice';
import type { Event } from '../../store/slices/eventsSlice';
import styles from './EventDetail.module.css';

const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { events, currentEvent } = useAppSelector((state) => state.events);

  useEffect(() => {
    if (id && events.length > 0) {
      const event = events.find((event: Event) => event.id === id);
      if (event) {
        dispatch(setCurrentEvent(event));
      } else {
        navigate('/events');
      }
    }
  }, [id, events, dispatch, navigate]);

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString('ko-KR', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        weekday: 'long'
      }),
      time: date.toLocaleTimeString('ko-KR', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true
      })
    };
  };

  if (!currentEvent) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  const { date, time } = formatDateTime(currentEvent.dateTime);
  const uploadDate = formatDateTime(currentEvent.uploadAt);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link to="/events" className={styles.backBtn}>
          ← 목록으로 돌아가기
        </Link>
        <div className={styles.menuBadge}>Menu #{currentEvent.menuId}</div>
      </div>

      <div className={styles.eventCard}>
        <div className={styles.eventHeader}>
          <h1 className={styles.title}>{currentEvent.subject}</h1>
          <div className={styles.eventMeta}>
            <div className={styles.metaItem}>
              <span className={styles.metaIcon}>📅</span>
              <div>
                <div className={styles.metaLabel}>날짜</div>
                <div className={styles.metaValue}>{date}</div>
              </div>
            </div>
            
            <div className={styles.metaItem}>
              <span className={styles.metaIcon}>⏰</span>
              <div>
                <div className={styles.metaLabel}>시간</div>
                <div className={styles.metaValue}>{time}</div>
              </div>
            </div>
            
            <div className={styles.metaItem}>
              <span className={styles.metaIcon}>📍</span>
              <div>
                <div className={styles.metaLabel}>장소</div>
                <div className={styles.metaValue}>{currentEvent.place}</div>
              </div>
            </div>
            
            <div className={styles.metaItem}>
              <span className={styles.metaIcon}>👥</span>
              <div>
                <div className={styles.metaLabel}>최대 참가자</div>
                <div className={styles.metaValue}>{currentEvent.maxParticipants}명</div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.content}>
          <h2>이벤트 설명</h2>
          <div className={styles.contentText}>
            {currentEvent.content.split('\n').map((paragraph: string, index: number) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>

        <div className={styles.footer}>
          <div className={styles.footerInfo}>
            <span className={styles.footerLabel}>생성일:</span>
            <span className={styles.footerValue}>
              {uploadDate.date} {uploadDate.time}
            </span>
          </div>
          
          <div className={styles.actions}>
            <button 
              className={styles.editBtn}
              onClick={() => {
                // In a real app, you would navigate to edit page
                alert('편집 기능은 추후 구현 예정입니다.');
              }}
            >
              수정
            </button>
            <button 
              className={styles.deleteBtn}
              onClick={() => {
                if (window.confirm('정말로 이 이벤트를 삭제하시겠습니까?')) {
                  // In a real app, you would dispatch delete action
                  alert('삭제 기능은 추후 구현 예정입니다.');
                }
              }}
            >
              삭제
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail; 
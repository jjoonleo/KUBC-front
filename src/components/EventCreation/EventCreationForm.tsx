import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../store/hooks';
import { addEvent } from '../../store/slices/eventsSlice';
import { Event } from '../../store/slices/eventsSlice';
import { AuthService } from '../../services/authService';
import styles from './EventCreationForm.module.css';

interface EventFormData {
  dateTime: string;
  menuId: number;
  place: string;
  maxParticipants: number;
  subject: string;
  content: string;
}

const EventCreationForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<EventFormData>>({});
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    register: registerStep1,
    handleSubmit: handleSubmitStep1,
    formState: { errors: errorsStep1 }
  } = useForm<Pick<EventFormData, 'dateTime' | 'menuId' | 'place' | 'maxParticipants'>>();

  const {
    register: registerStep2,
    handleSubmit: handleSubmitStep2,
    formState: { errors: errorsStep2 }
  } = useForm<Pick<EventFormData, 'subject' | 'content'>>();

  const onSubmitStep1: SubmitHandler<Pick<EventFormData, 'dateTime' | 'menuId' | 'place' | 'maxParticipants'>> = (data) => {
    setFormData(prev => ({ ...prev, ...data }));
    setCurrentStep(2);
  };

  const onSubmitStep2: SubmitHandler<Pick<EventFormData, 'subject' | 'content'>> = async (data) => {
    const completeFormData = { ...formData, ...data } as EventFormData;
    
    try {
      setSubmitting(true);
      
      // Create event object
      const newEvent: Event = {
        id: Date.now().toString(), // Temporary ID - backend will assign real ID
        dateTime: completeFormData.dateTime,
        menuId: completeFormData.menuId,
        place: completeFormData.place,
        maxParticipants: completeFormData.maxParticipants,
        subject: completeFormData.subject,
        content: completeFormData.content,
        uploadAt: new Date().toISOString(),
      };

      // TODO: Replace with actual API call to backend
      // const response = await fetch(`${API_BASE_URL}/api/events`, {
      //   method: 'POST',
      //   headers: AuthService.getAuthHeaders(),
      //   body: JSON.stringify(newEvent),
      // });
      
      // For now, just add to Redux store
      dispatch(addEvent(newEvent));
      navigate('/events');
      
    } catch (error) {
      console.error('Failed to create event:', error);
      alert('Failed to create event. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const goBack = () => {
    setCurrentStep(1);
  };

  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        <div className={styles.header}>
          <h1>이벤트 생성</h1>
          <div className={styles.progressBar}>
            <div className={`${styles.step} ${currentStep >= 1 ? styles.active : ''}`}>1</div>
            <div className={styles.line}></div>
            <div className={`${styles.step} ${currentStep >= 2 ? styles.active : ''}`}>2</div>
          </div>
        </div>

        {currentStep === 1 && (
          <form onSubmit={handleSubmitStep1(onSubmitStep1)} className={styles.form}>
            <h2>기본 정보</h2>
            
            <div className={styles.formGroup}>
              <label htmlFor="dateTime">날짜 및 시간</label>
              <input
                type="datetime-local"
                id="dateTime"
                {...registerStep1('dateTime', { required: '날짜와 시간을 입력해주세요.' })}
                className={errorsStep1.dateTime ? styles.error : ''}
              />
              {errorsStep1.dateTime && <span className={styles.errorMessage}>{errorsStep1.dateTime.message}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="menuId">메뉴 ID</label>
              <input
                type="number"
                id="menuId"
                {...registerStep1('menuId', { 
                  required: '메뉴 ID를 입력해주세요.',
                  min: { value: 1, message: '메뉴 ID는 1 이상이어야 합니다.' }
                })}
                className={errorsStep1.menuId ? styles.error : ''}
              />
              {errorsStep1.menuId && <span className={styles.errorMessage}>{errorsStep1.menuId.message}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="place">장소</label>
              <input
                type="text"
                id="place"
                placeholder="예: KUBC Meeting Room A"
                {...registerStep1('place', { required: '장소를 입력해주세요.' })}
                className={errorsStep1.place ? styles.error : ''}
              />
              {errorsStep1.place && <span className={styles.errorMessage}>{errorsStep1.place.message}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="maxParticipants">최대 참가자 수</label>
              <input
                type="number"
                id="maxParticipants"
                {...registerStep1('maxParticipants', { 
                  required: '최대 참가자 수를 입력해주세요.',
                  min: { value: 1, message: '최대 참가자 수는 1명 이상이어야 합니다.' }
                })}
                className={errorsStep1.maxParticipants ? styles.error : ''}
              />
              {errorsStep1.maxParticipants && <span className={styles.errorMessage}>{errorsStep1.maxParticipants.message}</span>}
            </div>

            <div className={styles.buttonGroup}>
              <button type="button" onClick={() => navigate('/events')} className={styles.cancelBtn}>
                취소
              </button>
              <button type="submit" className={styles.nextBtn}>
                다음
              </button>
            </div>
          </form>
        )}

        {currentStep === 2 && (
          <form onSubmit={handleSubmitStep2(onSubmitStep2)} className={styles.form}>
            <h2>내용 작성</h2>
            
            <div className={styles.formGroup}>
              <label htmlFor="subject">제목</label>
              <input
                type="text"
                id="subject"
                placeholder="예: Badminton Skills Workshop"
                {...registerStep2('subject', { required: '제목을 입력해주세요.' })}
                className={errorsStep2.subject ? styles.error : ''}
              />
              {errorsStep2.subject && <span className={styles.errorMessage}>{errorsStep2.subject.message}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="content">내용</label>
              <textarea
                id="content"
                rows={8}
                placeholder="이벤트에 대한 자세한 설명을 입력해주세요..."
                {...registerStep2('content', { required: '내용을 입력해주세요.' })}
                className={errorsStep2.content ? styles.error : ''}
              />
              {errorsStep2.content && <span className={styles.errorMessage}>{errorsStep2.content.message}</span>}
            </div>

            <div className={styles.buttonGroup}>
              <button type="button" onClick={goBack} className={styles.backBtn} disabled={submitting}>
                이전
              </button>
              <button type="submit" className={styles.submitBtn} disabled={submitting}>
                {submitting ? '생성 중...' : '이벤트 생성'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EventCreationForm; 
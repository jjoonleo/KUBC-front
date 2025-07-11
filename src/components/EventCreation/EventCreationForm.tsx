import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addEvent } from '../../store/slices/eventsSlice';
import { EventService } from '../../services/eventService';
import { EventFormData, EventCreateRequest } from '../../types/dtos/event';
import { MenuType, getMenuTypeLabel } from '../../types/entities/event';
import styles from './EventCreationForm.module.css';

const EventCreationForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<EventFormData>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const {
    register: registerStep1,
    handleSubmit: handleSubmitStep1,
    formState: { errors: errorsStep1 }
  } = useForm<Pick<EventFormData, 'dateTime' | 'menuId' | 'place' | 'maxParticipants' | 'uploadAt' | 'confirmedMemberAt'>>({
    defaultValues: {
      place: '서울정화고등학교 (별관)',
      menuId: 2,
      maxParticipants: 28
    }
  });

  const getDefaultSubject = (data?: Partial<EventFormData>) => {
    if (!data?.dateTime) return '[정기모임]\n정기모임 공지';
    
    const date = new Date(data.dateTime);
    const options: Intl.DateTimeFormatOptions = {
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    };
    const formattedDate = date.toLocaleDateString('ko-KR', options);
    
    return `[정기모임]${formattedDate} 정기모임 공지`;
  };

  const getDefaultContent = (data?: Partial<EventFormData>) => {
    const formatDateTime = (dateTime?: string) => {
      if (!dateTime) return '날짜 및 시간을 입력해주세요';
      const date = new Date(dateTime);
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
        hour: '2-digit',
        minute: '2-digit'
      };
      return date.toLocaleDateString('ko-KR', options);
    };

    const formatUploadTime = (uploadAt?: string) => {
      if (!uploadAt) return '업로드 시간을 입력해주세요';
      const date = new Date(uploadAt);
      const options: Intl.DateTimeFormatOptions = {
        month: 'long',
        day: 'numeric',
        weekday: 'long',
        hour: '2-digit',
        minute: '2-digit'
      };
      return date.toLocaleDateString('ko-KR', options);
    };

    const formatConfirmTime = (confirmedMemberAt?: string) => {
      if (!confirmedMemberAt) return '참가자 확정 시간을 입력해주세요';
      const date = new Date(confirmedMemberAt);
      const options: Intl.DateTimeFormatOptions = {
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      return date.toLocaleDateString('ko-KR', options);
    };

    return `1.시간 : ${formatDateTime(data?.dateTime)}


2. 장소 : ${data?.place || '장소를 입력해주세요'}

장소에 대한 자세한 설명을 여기에 추가해주세요.


네이버지도 기준 

교통편 정보를 여기에 추가해주세요.


3. 인원 : 집행부 포함 총 ${data?.maxParticipants || '00'}명 선착순 

불참자가 생길 경우 대기자로 참여 가능하오니 인원이 초과되더라도 일단 댓글을 달아주시면 감사하겠습니다. 


* 참가 집행부 :  


4. 손님 규정 : 댓글에 본인 댓글과 손님 댓글을 각각 따로 적고, 정모 당일 회원 자리 미충원 시 남은 자리만큼 손님을 받도록 하겠습니다. 정원 초과 상황에서의 손님 초대의 경우 정기모임 당 최대 1명의 손님을 초대할 수 있으며, 이때의 손님비는 기존 금액에서 15,000원으로 증가하게 됩니다. 


5. 댓글 기능 허용은 ${formatUploadTime(data?.uploadAt)} 인원 확정은 ${formatConfirmTime(data?.confirmedMemberAt)}입니다. 


6. 사이드 코트에서 레슨이 진행됩니다!

-레슨에 참여하고자 하시는 분들은 기본적으로 정모에 참석하셔야 합니다

-참여 의사가 있으신 분들은 "레슨 참"을 댓글에 함께 작성해주시길 바랍니다. (예시: "정모 참 레슨 참")

-수용 인원보다 레슨 희망자가 많을 시 실력 및 참여도를 고려하여 인원이 선택됩니다.

-레슨 참석 여부도 정모 참석 여부와 별개로 아래 벌칙 규칙이 적용됩니다.


7. 벌칙 규칙⭐️ 


-참가자 명단 업로드 이후로 불참 연락시 벌금 부과 

-정모 시작 3시간 전까지 연락시 벌금만 부과, 그 이후로 연락시 무단 불참 패널티(다음 정모 2회 참여 제한)과 벌금 같이 부과 

-정모 시작 5분 전까지 연락 없이 지각 하는 경우 무단 지각 패널티(다음 정모 1회 참여 제한) 

-대기자도 똑같이 벌칙 규칙 적용`;
  };

  const {
    register: registerStep2,
    handleSubmit: handleSubmitStep2,
    formState: { errors: errorsStep2 },
    reset: resetStep2
  } = useForm<Pick<EventFormData, 'subject' | 'content'>>();

  const onSubmitStep1: SubmitHandler<Pick<EventFormData, 'dateTime' | 'menuId' | 'place' | 'maxParticipants' | 'uploadAt' | 'confirmedMemberAt'>> = (data) => {
    const updatedFormData = { ...formData, ...data };
    setFormData(updatedFormData);
    setError(null);
    
    // Generate content and subject with the updated form data
    const defaultContent = getDefaultContent(updatedFormData);
    const defaultSubject = getDefaultSubject(updatedFormData);
    
    // Reset step 2 form with the generated content and subject
    resetStep2({
      subject: defaultSubject,
      content: defaultContent
    });
    
    setCurrentStep(2);
  };

  const onSubmitStep2: SubmitHandler<Pick<EventFormData, 'subject' | 'content'>> = async (data) => {
    const completeFormData = { ...formData, ...data } as EventFormData;
    
    if (!user) {
      setError('사용자 인증이 필요합니다. 다시 로그인해주세요.');
      return;
    }
    
    try {
      setSubmitting(true);
      setError(null);
      
      // Create event request data
      const eventRequest: EventCreateRequest = {
        dateTime: completeFormData.dateTime,
        menuId: completeFormData.menuId,
        place: completeFormData.place,
        maxParticipants: completeFormData.maxParticipants,
        subject: completeFormData.subject,
        content: completeFormData.content,
        uploadAt: new Date(completeFormData.uploadAt),
        confirmedMemberAt: new Date(completeFormData.confirmedMemberAt),
      };

      // Call backend API using axios
      const newEvent = await EventService.createEvent(eventRequest);
      
      // Add to Redux store for immediate UI update
      dispatch(addEvent(newEvent));
      
      // Navigate to events list
      navigate('/events');
      
    } catch (error) {
      console.error('Failed to create event:', error);
      setError(error instanceof Error ? error.message : 'Failed to create event. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const goBack = () => {
    setCurrentStep(1);
    setError(null);
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

        {/* Global error display */}
        {error && (
          <div className={styles.globalError}>
            {error}
          </div>
        )}

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
              <label htmlFor="menuId">메뉴 타입</label>
              <select
                id="menuId"
                {...registerStep1('menuId', { 
                  required: '메뉴 타입을 선택해주세요.',
                  valueAsNumber: true
                })}
                className={errorsStep1.menuId ? styles.error : ''}
              >
                <option value="">메뉴 타입을 선택하세요</option>
                <option value={MenuType.FREE_BOARD}>{getMenuTypeLabel(MenuType.FREE_BOARD)}</option>
                <option value={MenuType.REGULAR_MEETING_NOTICE}>{getMenuTypeLabel(MenuType.REGULAR_MEETING_NOTICE)}</option>
                <option value={MenuType.GENERAL_NOTICE}>{getMenuTypeLabel(MenuType.GENERAL_NOTICE)}</option>
                <option value={MenuType.ATTENDEE_LIST}>{getMenuTypeLabel(MenuType.ATTENDEE_LIST)}</option>
                <option value={MenuType.LIGHTNING_MEETING}>{getMenuTypeLabel(MenuType.LIGHTNING_MEETING)}</option>
              </select>
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
                  min: { value: 1, message: '최대 참가자 수는 1명 이상이어야 합니다.' },
                  valueAsNumber: true
                })}
                className={errorsStep1.maxParticipants ? styles.error : ''}
              />
              {errorsStep1.maxParticipants && <span className={styles.errorMessage}>{errorsStep1.maxParticipants.message}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="uploadAt">업로드 시간</label>
              <input
                type="datetime-local"
                id="uploadAt"
                {...registerStep1('uploadAt', { required: '업로드 시간을 입력해주세요.' })}
                className={errorsStep1.uploadAt ? styles.error : ''}
              />
              {errorsStep1.uploadAt && <span className={styles.errorMessage}>{errorsStep1.uploadAt.message}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="confirmedMemberAt">참가자 확정 시간</label>
              <input
                type="datetime-local"
                id="confirmedMemberAt"
                {...registerStep1('confirmedMemberAt', { required: '참가자 확정 시간을 입력해주세요.' })}
                className={errorsStep1.confirmedMemberAt ? styles.error : ''}
              />
              {errorsStep1.confirmedMemberAt && <span className={styles.errorMessage}>{errorsStep1.confirmedMemberAt.message}</span>}
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
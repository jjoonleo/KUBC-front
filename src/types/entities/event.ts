export enum MenuType {
  FREE_BOARD = 1, // "자유게시판"
  REGULAR_MEETING_NOTICE = 2, // "정모공지"
  GENERAL_NOTICE = 8, // "일반공지"
  ATTENDEE_LIST = 59, // "참석자 명단"
  LIGHTNING_MEETING = 61, // "번개모임"
}

export function getMenuTypeLabel(menuType: MenuType): string {
  switch (menuType) {
    case MenuType.FREE_BOARD:
      return "자유게시판";
    case MenuType.REGULAR_MEETING_NOTICE:
      return "정모공지";
    case MenuType.GENERAL_NOTICE:
      return "일반공지";
    case MenuType.ATTENDEE_LIST:
      return "참석자 명단";
    case MenuType.LIGHTNING_MEETING:
      return "번개모임";
    default:
      return "알 수 없음";
  }
}

export function getMenuTypeFromLabel(label: string): MenuType | null {
  switch (label) {
    case "자유게시판":
      return MenuType.FREE_BOARD;
    case "정모공지":
      return MenuType.REGULAR_MEETING_NOTICE;
    case "일반공지":
      return MenuType.GENERAL_NOTICE;
    case "참석자 명단":
      return MenuType.ATTENDEE_LIST;
    case "번개모임":
      return MenuType.LIGHTNING_MEETING;
    default:
      return null;
  }
}

export interface Event {
  id: number;
  cafeArticleId?: number;
  dateTime: Date;
  menuId: MenuType;
  place: string;
  maxParticipants: number;
  content: string;
  subject: string;
  uploadAt: string;
  confirmedMemberAt: Date;
  authorId: string;
  status: string;
}

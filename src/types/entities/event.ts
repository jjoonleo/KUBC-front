export interface Event {
  id: number;
  cafeArticleId?: number;
  dateTime: Date;
  menuId: number;
  place: string;
  maxParticipants: number;
  content: string;
  subject: string;
  uploadAt: string;
  confirmedMemberAt: Date;
  authorId: string;
  state: string;
}

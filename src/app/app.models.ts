export class Area {
  constructor(public id: number,
    public value: number,
    public unit: string) { }
}

export class AdditionalFeature {
  constructor(public id: number,
    public name: string,
    public value: string) { }
}

export class Location {
  constructor(public id: number,
    public lat: number,
    public lng: number) { }
}

export class Price {
  public sale: number;
  public rent: number;
}


export class Gallery {
  constructor(public id: number,
    public small: string,
    public medium: string,
    public big: string) { }
}

export class Plan {
  constructor(public id: number,
    public name: string,
    public desc: string,
    public area: Area,
    public rooms: number,
    public baths: number,
    public image: string) { }
}

export class Pagination {
  constructor(public page: number,
    public perPage: number,
    public prePage: number,
    public nextPage: number,
    public total: number,
    public totalPages: number) { }
}


export class BaseModel {
  lang: string;
}

export class SearchAttribute {
  parameters: string[];
  orderBy: string;
}

export class Role {
  id: number;
  name: string;
  description: string;
  status: number;
  type = 'Role';
}

export class UserGroup {
  id: number;
  name: string;
  type = 'UserGroup';
}

export class User extends BaseModel {
  id: number;
  userName: string;
  currentPassword: string;
  password: string;
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  picture = 'user.jpg';
  sex: string;
  homePhone: string;
  mobilePhone: string;
  address: string;
  city: string;
  country: string;
  zipCode: string;
  companyName: string;
  facebook: string;
  twitter: string;
  linkedin: string;
  instagram: string;
  website: string;
  birthDate: Date;
  status: number;
  userGroup: UserGroup;
  position: Position;
  receiveNewsletter: true;
  modifiedBy: number;
  // Transients
  confirmPassword: string;
  name: string;
  roles: Role[];
  type = 'User';
  fileNames: string[];
  shortResume: string;
  resume: string;
  employees: Employee[] = [];
  domain: Domain;
  phone: string;
  membershipDate: Date;
  membershipRenewDate: Date;
  deathDate: Date;
  countryOrigin: Country;
  countryResidence: Country;
  mum: User;
  dad: User;
  tutor1: User;
  tutor2: User;
  pic: string;
  alive = true;
  canApprove: boolean;
  cityOrigin: string;
  cityResidence: string;
  isOnline: boolean;
  data: string;
  token: string;
  role: number;
  occupation: number;
  state: string;
  error: string;
  mms: string;
  positionId: number;
  useCompanyContact: boolean;
  userDescs: UserDesc[];

  constructor() {
    super();
    this.userGroup = new UserGroup();
    this.position = new Position();
  }

}

export class UserDesc {
  id: number;
  user: User;
  language: string;
  resume: string;
	shortResume: string;
  modifiedBy: number;
  createDate: Date;

  type = 'UserDesc';
}

export class Domain {
  id: number;
  name: string;
}

export class Country {
  id: number;
  addressFormat: string;
  isoCode2: string;
  isoCode3: string;
  code: string;
  name: string;
  postcodeRequired: number;
  status: number;
  type = 'Country';
}

export class Employee {
  id: number;
  user: User = new User();
  shortResume: string;
  resume: string;
  status: number;

  name: string;
  type = 'Employee';
}

export class AuthToken {
  id: number;
  userName: string;
  password: string;
  firstName: string;
  lastName: string;
  middleName: string;
  token: string;
  roleName: string;
  picture: string;
  firstTimeLogin: string;
  authorities: number[];
  userId: number;
  homePage: string;
}


export class Company {
  id: number;
  name: string;
  description: string;
  metaKeyword: string;
  metaDescription: string;
  language: string;
  address: string;
  country: string;
  email: string;
  phone: string;
  phone2: string;
  fax: string;
  logo: 'logo.png';
  favicon = 'favicon.ico';
  backgroundSlider: string;
  bannerContentHeader: string;
  bannerContentParagraph: string;
  copyright: string;
  twitterApi: string;
  googleMap: string;
  facebookUrl: string;
  twitterUrl: string;
  linkedInUrl: string;
  instagramUrl: string;
  googlePlusUrl: string;
  footerParagraph1: string;
  footerParagraph2: string;
  footerParagraph3: string;
  fromEmail: string;
  toEmail: string;
  status = 0;
  footerType: string;
  displayMission = false;
  displayTestimonial = false;
  displayServices = false;
  displayClientLogos = false;
  displayTeams = false;
  displayAuthor = false;
  displayExpertise = false;
  displayFeatured = false;
  displayBlogs = false;
  displayShortLang = false;
  displayToolbar = false;
  displayFooterContact = false;
  displayFeaturedBlogs = false;
  displayLangMenu = true;
  displayMenuCareer = false;
  displayMenuPoll = false;
  displayMenuBlog = false;
  displayMenuProject = false;
  displayMenuEvent = false;
  displayProjects = false;
  displayPolls = false;
  acceptCardPayment = false;
  acceptTmoneyPayment = false;
  acceptFloozPayment = false;
  fixedMenu: number;
  leftToRight: number;
  headerTextPosition: number;
  headerImageType: string;
  themeColor: string;
  website: string;
  careerBannerTitle: string;
  careerBannerText: string;
  useId: boolean;
  currencyCode: string;
  
  type = 'Company';
  modifiedBy: number;
}

export class Setting {
  fixedMenu: number;
  leftToRight: number;
  headerTextPosition: number;
  headerImageType: string;
  themeColor: string;
}

export class News {
  id: number;
  author: User;
  language: string;
  title: string;
  shortTitle: string;
  content: string;
  shortMessage: string;
  mediumMessage: string;
  publicationDatetime: Date;
  modDate: Date;
  viewCount: number;
  rating: number;
  ratingCount: number;
  picture: string;
  authorText: string;
  status: number;
  featured: number;
  gallery: any[];
  videos: Video[] = [];
  modifiedBy: number;
  type = 'News';
  fileNames: string[];
  constructor() {
    this.author = new User();
  }

}

export class NewsVideo {
  id: number;
  news: News;
  name: string;
  link: string;
  embedVideo: any;
  status: number;
  type = 'NewsVideo';
  modifiedBy: number;
  modDate: Date;
  constructor() {
    this.modifiedBy = 1;
    this.modDate = new Date();
  }
}


export class Section {
  id: number;
  name: string;
  title: string;
  description: string;
  summary: string;
  mediumMessage: string;
  picture: string;
  menu: string;
  status: number;
  rank: number;
  showInMenu: number;
  language: string;
  sectionLabel: string;
  statusDesc: string;
  type = 'Section';
  modifiedBy: number;
  constructor() {
    this.picture = 'section.jpg';
  }
}


export class SectionItem {
  id: number;
  section: Section;
  title: string;
  name: string;
  description: string;
  shortMessage: string;
  mediumMessage: string;
  summary: string;
  picture: string;
  status: number;
  rank: number;
  showInMenu: number;
  language: string;
  modifiedBy: number;
  text1: string;
  text2: string;
  text3: string;
  type = 'SectionItem';
  constructor() {
    this.picture = '';
  }
}

export class ContactUsMessage extends BaseModel {
  id: number;
  createDate: Date
  name: string;
  email: string;
  project: Project;
  news: News;
  phone: string;
  message: string;
  modifiedBy: number;

  type = 'ContactUsMessage';
}

export class Slider {
  id: number;
  name: '';
  rank: number;
  picture: string;
  status: number;
  type = 'Slider';
  modifiedBy: number;
  constructor() {
    this.picture = '';
  }

}

export class SliderText {
  id: number;
  slider: Slider;
  text1: '';
  text2: '';
  text3: '';
  modifiedBy: number;
  language: string;
  type = 'SliderText';
}

export class Faq {
  id: number;
  language: string;
  question: string;
  answer: string;
  noCount: number;
  yesCount: number;
  modifiedBy: number;
  status: number;
  type = 'Faq';
}

export class MailingList {
  id: number;
  email: string;
  modifiedBy: number;
  status: number;
  type = 'MailingList';
}
export class GenericResponse {
  result: string;
  message: string;
}

export class Comment {
  id: number;
  news: News;
  project: Project;
  rating: number;
  message: string;
  author: string;
  authorEmail: string;
  modifiedBy: number;
  status: number;
  modDate: Date;
  createDate: Date;
  type = 'Comment';
}

export class CompanyLocation {
  id: number;
  address: string;
  comment: string;
  fax: string;
  geocode: string;
  rank: number;
  image: string;
  name: string;
  open: string;
  telephone: string;
  type = 'Location';
}

export class Vote {
  id: number;
  user: User;
  pollChoice: PollChoice;
  status: number;

  type = 'Vote';
}

export class Position {
  id: number;
  rank: number;
  leadership = 0;
  status = 1;
  positionDescs: PositionDesc[] = [];

  name: string;
  type = 'Position';
}

export class PositionDesc {
  id: number;
  position: Position;
  language: string;
  name: string;
  description: string;
  status = 1;

  type = 'PositionDesc';
}


export class Project {
  id: number;
  budget: number;
  totalContributions: number;
  totalExpenses: number;
  projectedStartDate: Date;
  projectedEndDate: Date;
  startDate: Date;
  endDate: Date;
  hasPhoto: boolean;
  pics: Picture[];
  data: any;
  pdata: any;
  contributions: Contribution[];
  expenses: Transaction[];
  minContribution: number;
  maxContribution: number;
  totalFees: number;
  status: number;
  modifiedBy: number;
  remainingFileNames: string[] = [];
  viewCount: number;
  ratingCount: number;
  rating: number;
  gallery: any[];
  videos: Video[] = [];
  user: User;
  createDate: Date;
  modDate: Date;
  type = 'Project';
  fileNames: string[];
  projectDescs: ProjectDesc[];

}

export class ProjectDesc {
  id: number;
  language: string;
  title: string;
  description: string;
  sponsors: string;
  budget: number;
  shortDescription: string;
  status: number;
  modifiedBy: number;
  remainingFileNames: string[] = [];
  objectif: string;
  location: string;
  inovation: string;
  existant: string;
  resource: string;
  execution: string;
  constraints: string;
  feasibility: string;
  budgetLine: string;
  result: string;
  duration: string;
  project: Project;
  createDate: Date;
  modDate: Date;
  type = 'ProjectDesc';
  fileNames: string[];


}


export class Transaction {
  id: number;
  project: Project;
  createDate: Date;
  member: string;
  amount: number;
  anonymous: boolean;
  comment: string;
  refNbbr: string;
  user: User;
  io: number;
  rebate = 0;
  currencyCode: string;
  modifiedBy: number;
  tranDate: Date;
  projectTitle: string;
  memberName: string;
  phone: string;
  paymentMethod: string;
  failureReason: string;
  status: number;


  type = 'Transaction';

  constructor() {
    this.project = new Project();
  }
}

export class PollType {
  id: number;
  status = 1;
  pollTypeDescs: PollTypeDesc[] = [];

  type = 'PollType';
}

export class PollTypeDesc {
  id: number;
  name: string;
  language: string;
  pollType: PollType;

  type = 'PollTypeDesc';
}

export class Poll {
  id: number;
  pollType: PollType;
  pollTypeId: number;
  status = 1;
  userId: number;
  pollDescs: PollDesc[] = [];

  type = 'Poll';
}

export class PollDesc {
  id: number;
  poll: Poll;
  language: string;
  description: string;
  endNote: string;
  title: string;
  pollTypeDescName: string;
  createDate: Date;

  type = 'PollDesc';
}

export class PollQuestion {
  id: number;
  rank: number;
  poll: Poll;
  position: Position;
  status = 1;
  pollQuestionDescs: PollQuestionDesc[] = [];
  pollChoices: PollChoice[] = [];

  type = 'PollQuestion';
}

export class PollQuestionDesc {
  id: number;
  pollQuestion: PollQuestion;
  language: string;
  description: string;

  type = 'PollQuestionDesc';
}

export class PollChoice {
  id: number;
  rank: number;
  user: User;
  voteCount: number;
  voteCounts: number;
  winner: boolean;
  pollQuestion: PollQuestion;
  pollChoiceDescs: PollChoiceDesc[] = [];
  voted: boolean;

  type = 'PollChoice';
}

export class PollChoiceDesc {
  id: number;
  pollChoice: PollChoice;
  language: string;
  description: string;
  type = 'PollChoiceDesc';
}

export class Contribution {
  tranId: number;
  project: string;
  date: Date;
  member: string;
  amount: number;
  anonymous: boolean;
}

export class ChartData {
  label: string[];
  data1: number[];
  data2: number[];
}

export class Email {
  subject: string;
  body: string;
  sendEmail: boolean;
  sendSms: boolean;
}

export class Picture {

}

export class StatusText {
  id: number;
  language: string;
  content: string;
  status: number;
  modifiedBy: number;

  type = 'StatusText';
}

export class Regulation {
  id: number;
  language: string;
  content: string;
  status: number;
  modifiedBy: number;

  type = 'Regulation';
}

export class MeetingReport {
  id: number;
  meetingDate: Date;
  author: User;
  status = 1;
  meetingReportDescs: MeetingReportDesc[] = [];

  type = 'MeetingReport';
}

export class MeetingReportDesc {
  id: number;
  meetingReport: MeetingReport;
  language: string;
  title: string;
  message: string;

  type = 'MeetingReportDesc';
}

export class Publicity {
  id: number;
  description: string;
  link: string;
  picture: string;
  status = 1;
  rank: number;
  cost: number;
  beginDate: Date;
  endDate: Date;
  modifiedBy: number;
  fileNames: string[];

  type = 'Publicity';
}

export class Video {
  id: number;
  description: string;
  link: string;
  news: News;
  project: Project;
  name: string;
  embedVideo: any;
  status: number;
  rank: number;
  videoDate: Date;
  vote = 1;
  voteCount: number;
  modifiedBy: number;
  fileNames: string[];
  type = 'Video';
}


export class Image {
  id: number;
  description: string;
  title: string;
  picture: string;
  status = 1;
  rank: number;
  modifiedBy: number;
  fileNames: string[];

  type = 'Image';
}


export class PollSearchCriteria {
  id: number;
  language: string;
  status: number;
}


export class JobPosition {
  id: number;
  location: string;
  rank: number;
  status = 1;
  jobPositionDescs: JobPositionDesc[];

  type = 'JobPosition';
  modifiedBy: number;
  constructor() {
  }

}

export class JobPositionDesc {
  id: number;
  jobPosition: JobPosition;
  language: string;
  title: string;
	description: string;
  modifiedBy: number;
  jobAppliCnt: number;

  type = 'JobPositionDesc';
}

export class JobAppli {
  id: number;
  jobPosition: JobPosition;
  applicant: User;
  firstName: string;
  lastName: string;
	middleName: string;
	phone: string;
	email: string;
	notes: string;
  doc: string;
  status = 1;
  useId = false;
  modifiedBy: number;

  type = 'JobAppli';
}


export class Event {
  id: number;
  location: string;
  picture: string;
  rank: number;
  coordinator: User;
  beginDate: Date;
  endDate: Date;
  status = 1;
  eventDescs: EventDesc[];

  type = 'Event';
  modifiedBy: number;
  remainingFileNames: string[] = [];
  fileNames: string[];

  // Transient
  beginHour: string;
  beginMinute: string;
  endHour: string;
  endMinute: string;

  constructor() {
  }

}

export class EventDesc {
  id: number;
  event: Event;
  language: string;
  title: string;
	description: string;
  modifiedBy: number;
  createDate: Date;

  type = 'EventDesc';
}
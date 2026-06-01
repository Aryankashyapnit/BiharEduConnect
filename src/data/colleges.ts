export interface College {
  id: string;
  name: string;
  code: string;
  location: string;
  established: number;
  nirf: number | null;
  averagePackage: number; // in LPA
  highestPackage: number; // in LPA
  tuitionFee: number; // Annual in INR
  hostelAvailable: boolean;
  hostelFee: number; // Annual in INR
  website: string;
  description: string;
  campusSize: string;
  branches: string[];
  recruits: string[];
  image: string;
}

export const collegesData: College[] = [
  {
    id: "mit-muzaffarpur",
    name: "Muzaffarpur Institute of Technology",
    code: "MIT-MUZAFFARPUR",
    location: "Muzaffarpur",
    established: 1954,
    nirf: 151,
    averagePackage: 5.8,
    highestPackage: 18.0,
    tuitionFee: 10500,
    hostelAvailable: true,
    hostelFee: 12000,
    website: "https://www.mitmuzaffarpur.org",
    description: "Muzaffarpur Institute of Technology (MIT) is a premier state government-aided engineering college under BCECE, renowned for its rich academic heritage, sprawling campus, and excellent laboratory infrastructures.",
    campusSize: "55 Acres",
    branches: ["CSE", "IT", "ECE", "EE", "ME", "CE", "Leather Technology"],
    recruits: ["TCS", "Infosys", "Wipro", "Cognizant", "L&T", "Alstom", "Prism Cement"],
    image: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "bce-bhagalpur",
    name: "Bhagalpur College of Engineering",
    code: "BCE-BHAGALPUR",
    location: "Bhagalpur",
    established: 1960,
    nirf: 201,
    averagePackage: 5.2,
    highestPackage: 15.6,
    tuitionFee: 9800,
    hostelAvailable: true,
    hostelFee: 11000,
    website: "https://www.bcebhagalpur.ac.in",
    description: "Bhagalpur College of Engineering (BCE) is one of the oldest and most prestigious state engineering colleges in Bihar. It has a strong legacy of producing exceptional civil, mechanical, and electrical engineers.",
    campusSize: "50 Acres",
    branches: ["CSE", "ECE", "EE", "ME", "CE"],
    recruits: ["TCS", "Infosys", "IBM", "L&T", "Prism Cement", "HCL"],
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "gce-gaya",
    name: "Gaya College of Engineering",
    code: "GCE-GAYA",
    location: "Gaya",
    established: 2008,
    nirf: null,
    averagePackage: 4.5,
    highestPackage: 12.0,
    tuitionFee: 8500,
    hostelAvailable: true,
    hostelFee: 9500,
    website: "https://www.gcegaya.ac.in",
    description: "Gaya College of Engineering (GCE) provides excellent technical education and skills, backed by highly qualified faculty members and state-of-the-art computational facilities in southern Bihar.",
    campusSize: "42 Acres",
    branches: ["CSE", "ECE", "EEE", "ME", "CE"],
    recruits: ["Wipro", "TCS", "Cognizant", "Grifeo", "Collabera"],
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "nce-chandi",
    name: "Nalanda College of Engineering",
    code: "NCE-CHANDI",
    location: "Chandi, Nalanda",
    established: 2008,
    nirf: null,
    averagePackage: 4.3,
    highestPackage: 10.5,
    tuitionFee: 8500,
    hostelAvailable: true,
    hostelFee: 9000,
    website: "https://www.ncechandi.ac.in",
    description: "Nalanda College of Engineering (NCE) is located in Chandi near the historic ruins of Nalanda. The institution emphasizes research, discipline, and outstanding technical expertise.",
    campusSize: "38 Acres",
    branches: ["CSE", "ECE", "EEE", "ME", "CE"],
    recruits: ["TCS", "Infosys", "Syntel", "Hexaware", "Polycab"],
    image: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "dce-darbhanga",
    name: "Darbhanga College of Engineering",
    code: "DCE-DARBHANGA",
    location: "Darbhanga",
    established: 2008,
    nirf: null,
    averagePackage: 4.1,
    highestPackage: 9.8,
    tuitionFee: 8500,
    hostelAvailable: true,
    hostelFee: 9500,
    website: "https://www.dcedarbhanga.ac.in",
    description: "Darbhanga College of Engineering (DCE) serves as a major hub of technical excellence in North Bihar, offering cutting-edge B.Tech programs in diverse fields of engineering.",
    campusSize: "40 Acres",
    branches: ["CSE", "ECE", "EE", "ME", "CE"],
    recruits: ["TCS", "Infosys", "Cognizant", "Mindtree", "Vastu Bihar"],
    image: "https://images.unsplash.com/photo-1527891751199-7225231a68dd?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "bce-bakhtiyarpur",
    name: "Bakhtiyarpur College of Engineering",
    code: "BCE-BAKHTIYARPUR",
    location: "Bakhtiyarpur, Patna",
    established: 2016,
    nirf: null,
    averagePackage: 4.6,
    highestPackage: 14.0,
    tuitionFee: 9500,
    hostelAvailable: true,
    hostelFee: 10500,
    website: "https://www.bcepatna.ac.in",
    description: "Located in the Patna metropolitan region, Bakhtiyarpur College of Engineering (BCE Patna) boasts state-of-the-art campus buildings, superb transit links, and strong placement tie-ups.",
    campusSize: "25 Acres",
    branches: ["CSE", "ECE", "EE", "ME", "CE", "CSE-IOT"],
    recruits: ["TCS", "Wipro", "Accenture", "L&T Construction", "KEC International"],
    image: "https://images.unsplash.com/photo-1598981457915-aea220950616?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "mce-motihari",
    name: "Motihari College of Engineering",
    code: "MCE-MOTIHARI",
    location: "Motihari",
    established: 2008,
    nirf: null,
    averagePackage: 3.9,
    highestPackage: 8.5,
    tuitionFee: 8500,
    hostelAvailable: true,
    hostelFee: 9000,
    website: "https://www.mcemotihari.ac.in",
    description: "Motihari College of Engineering (MCE) is a premier engineering college situated in Champaran, promoting quality technical education and local entrepreneurial development.",
    campusSize: "35 Acres",
    branches: ["CSE", "ECE", "EE", "ME", "CE"],
    recruits: ["TCS", "HCL", "Prism Cement", "Webkul", "Grifeo"],
    image: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "lnjpit-chapra",
    name: "Lok Nayak Jai Prakash Institute of Technology",
    code: "LNJPIT-CHAPRA",
    location: "Chapra",
    established: 2012,
    nirf: null,
    averagePackage: 4.0,
    highestPackage: 9.0,
    tuitionFee: 8500,
    hostelAvailable: true,
    hostelFee: 9200,
    website: "https://www.lnjpit.ac.in",
    description: "LNJPIT Chapra is state-of-the-art government institution focused on enhancing core technical competencies, located on the banks of River Ganga, Chapra.",
    campusSize: "40 Acres",
    branches: ["CSE", "ECE", "EE", "ME", "CE"],
    recruits: ["TCS", "Wipro", "Infosys", "Genpact", "Okaya"],
    image: "https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "sce-sasaram",
    name: "Shershah College of Engineering",
    code: "SCE-SASARAM",
    location: "Sasaram",
    established: 2016,
    nirf: null,
    averagePackage: 3.8,
    highestPackage: 8.0,
    tuitionFee: 8500,
    hostelAvailable: true,
    hostelFee: 8800,
    website: "https://www.scesasaram.ac.in",
    description: "Named after the historic Shershah Suri, SCE Sasaram provides a vibrant learning environment with advanced labs, technical fests, and digital classrooms.",
    campusSize: "30 Acres",
    branches: ["CSE", "ECE", "EE", "ME", "CE"],
    recruits: ["TCS", "Amdocs", "Sasken", "Vastu Bihar"],
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "rrsdce-begusarai",
    name: "Rashtrakavi Ramdhari Singh Dinkar College of Engineering",
    code: "RRSDCE-BEGUSARAI",
    location: "Begusarai",
    established: 2016,
    nirf: null,
    averagePackage: 4.2,
    highestPackage: 10.0,
    tuitionFee: 8500,
    hostelAvailable: true,
    hostelFee: 9000,
    website: "https://www.rrsdce.ac.in",
    description: "Located in the industrial capital of Bihar, RRSDCE Begusarai has an edge in industrial internship linkages, chemical engineering interfaces, and computational sciences.",
    campusSize: "28 Acres",
    branches: ["CSE", "ECE", "EE", "ME", "CE", "Chemical Engineering"],
    recruits: ["IOCL (Internship)", "TCS", "Wipro", "Infosys", "Shriram Pistons"],
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=600"
  }
];

export const branchNames: Record<string, string> = {
  CSE: "Computer Science & Engineering",
  IT: "Information Technology",
  ECE: "Electronics & Communication Engineering",
  EE: "Electrical Engineering",
  EEE: "Electrical & Electronics Engineering",
  ME: "Mechanical Engineering",
  CE: "Civil Engineering",
  "Leather Technology": "Leather Technology",
  "Chemical Engineering": "Chemical Engineering",
  "CSE-IOT": "CSE (Internet of Things)"
};

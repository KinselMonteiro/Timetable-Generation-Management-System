const DEFAULT_TEACHER_PASSWORD = "teacher123";

const DEPARTMENT_ALIASES = {
  "SCIENCE AND HUMANITIES": "SCIENCE_HUMANITIES",
  "SCIENCE_HUMANITIES": "SCIENCE_HUMANITIES",
  "SCIENCE & HUMANITIES": "SCIENCE_HUMANITIES",
  UNIVERSAL: "SCIENCE_HUMANITIES"
};

function normalizeDirectoryDepartment(value) {
  const rawValue = String(value || "").trim().toUpperCase();
  if (!rawValue) {
    return null;
  }

  return DEPARTMENT_ALIASES[rawValue] || rawValue.replace(/[\s&/-]+/g, "_");
}

function teacherUser({ name, email, department, facultyName }) {
  return {
    name,
    email,
    password: DEFAULT_TEACHER_PASSWORD,
    role: "teacher",
    department: normalizeDirectoryDepartment(department),
    faculty_name: facultyName || name
  };
}

const facultyDirectoryUsers = [
  teacherUser({ name: "Avil D'sa", email: "avil.d.sa@dbce.com", department: "MECH", facultyName: "Avil D'sa" }),
  teacherUser({ name: "Dr. Amit Naik", email: "amit.naik@dbce.com", department: "COMP", facultyName: "Dr. Amit Naik" }),
  teacherUser({ name: "Dr. Amrita Naik", email: "amrita.naik@dbce.com", department: "COMP", facultyName: "Dr. Amrita Naik" }),
  teacherUser({ name: "Dr. Chetan Gaonkar", email: "chetan.gaonkar@dbce.com", department: "MECH", facultyName: "Dr. Chetan Gaonkar" }),
  teacherUser({ name: "Dr. D S Vidya", email: "d.s.vidya@dbce.com", department: "ECS", facultyName: "Dr. D S Vidya" }),
  teacherUser({ name: "Dr. Kala Nayak", email: "kala.nayak@dbce.com", department: "UNIVERSAL", facultyName: "Dr. Kala Nayak" }),
  teacherUser({ name: "Dr. Neena Panandikar", email: "neena.panandikar@dbce.com", department: "UNIVERSAL", facultyName: "Dr. Neena Panandikar" }),
  teacherUser({ name: "Dr. Nilesh Fondekar", email: "nilesh.fondekar@dbce.com", department: "MECH", facultyName: "Dr. Nilesh Fondekar" }),
  teacherUser({ name: "Dr. Rolando Da Cruz", email: "rolando.da.cruz@dbce.com", department: "ECS", facultyName: "Dr. Rolando Da Cruz" }),
  teacherUser({ name: "Dr. Shreyas Simu", email: "shreyas@dbce.com", department: "ECS", facultyName: "Dr. Shreyas" }),
  teacherUser({ name: "Dr. Shwetha Prasanna", email: "shwetha.prasanna@dbce.com", department: "CIVIL", facultyName: "Dr. Shwetha Prasanna" }),
  teacherUser({ name: "Dr. Suraj Marathe", email: "suraj.marathe@dbce.com", department: "MECH", facultyName: "Dr. Suraj Marathe" }),
  teacherUser({ name: "Fr. Austin Fernandes", email: "fr.austin.fernandes@dbce.com", department: "UNIVERSAL", facultyName: "Fr. Austin Fernandes" }),
  teacherUser({ name: "Fr. Rawlin Dsouza", email: "fr.rawlin.dsouza@dbce.com", department: "UNIVERSAL", facultyName: "Fr. Rawlin Dsouza" }),
  teacherUser({ name: "Ms. Kimberly Moraes", email: "kimberly.moraes@dbce.com", department: "ECS", facultyName: "Ms. Kimberly Moraes" }),
  teacherUser({ name: "Mr. Ajit Salunke", email: "ajit.salunke@dbce.com", department: "MECH", facultyName: "Mr. Ajit Salunke" }),
  teacherUser({ name: "Mr. Amey Tilve", email: "amey.tilve@dbce.com", department: "COMP", facultyName: "Mr. Amey Tilve" }),
  teacherUser({ name: "Mr. Aniket Naik", email: "aniket.naik@dbce.com", department: "MECH", facultyName: "Mr. Aniket Naik" }),
  teacherUser({ name: "Mr. Anish Bandekar", email: "anish.bandekar@dbce.com", department: "MECH", facultyName: "Mr. Anish Bandekar" }),
  teacherUser({ name: "Mr. Clifford Britto", email: "clifford.britto@dbce.com", department: "UNIVERSAL", facultyName: "Mr. Clifford Britto" }),
  teacherUser({ name: "Mr. Deron Rodrigues", email: "deron.rodrigues@dbce.com", department: "ECS", facultyName: "Mr. Deron Rodrigues" }),
  teacherUser({ name: "Mr. Gaurish Samant", email: "gaurish.samant@dbce.com", department: "MECH", facultyName: "Mr. Gaurish Samant" }),
  teacherUser({ name: "Mr. Gitesh Mestri", email: "gitesh.mestri@dbce.com", department: "CIVIL", facultyName: "Mr. Gitesh Mestri" }),
  teacherUser({ name: "Mr. Harison Cota", email: "harison.cota@dbce.com", department: "SCIENCE AND HUMANITIES", facultyName: "Mr. Harison Cota" }),
  teacherUser({ name: "Mr. Jeffery Valadares", email: "jeffery.valadares@dbce.com", department: "CIVIL", facultyName: "Mr. Jeffery Valadares" }),
  teacherUser({ name: "Mr. Jhanvi Naik", email: "jhanvi.naik@dbce.com", department: "COMP", facultyName: "Mr. Jhanvi Naik" }),
  teacherUser({ name: "Mr. Mithil Parab", email: "mithil.parab@dbce.com", department: "COMP", facultyName: "Mr. Mithil Parab" }),
  teacherUser({ name: "Mr. Nathan J. Dias", email: "nathan.j.dias@dbce.com", department: "CIVIL", facultyName: "Mr. Nathan J. Dias" }),
  teacherUser({ name: "Mr. Sachin Turi", email: "sachin.turi@dbce.com", department: "MECH", facultyName: "Mr. Sachin Turi" }),
  teacherUser({ name: "Mr. Sanjeel Naik", email: "sanjeel.naik@dbce.com", department: "MECH", facultyName: "Mr. Sanjeel Naik" }),
  teacherUser({ name: "Mr. Selvyn Fernandes", email: "selvyn.fernandes@dbce.com", department: "ECS", facultyName: "Mr. Selvyn Fernandes" }),
  teacherUser({ name: "Mr. Sharad Shanbhag", email: "sharad.shanbhag@dbce.com", department: "MECH", facultyName: "Mr. Sharad Shanbhag" }),
  teacherUser({ name: "Mr. Swapnil Ramani", email: "swapnil.ramani@dbce.com", department: "MECH", facultyName: "Mr. Swapnil Ramani" }),
  teacherUser({ name: "Mr. Tanay Rege", email: "tanay.rege@dbce.com", department: "MECH", facultyName: "Mr. Tanay Rege" }),
  teacherUser({ name: "Mr. Yeshudas Muttu", email: "yeshudas.muttu@dbce.com", department: "ECS", facultyName: "Mr. Yeshudas Muttu" }),
  teacherUser({ name: "Mr. Kevin Anthony Pereira", email: "mr.kevin.anthony.pereira@dbce.com", department: "SCIENCE AND HUMANITIES", facultyName: "Mr. Kevin Anthony Pereira" }),
  teacherUser({ name: "Mrs. Michelle Araujo e Viegas", email: "michelle.araujo.e.viegas@dbce.com", department: "ECS", facultyName: "Mrs. Michelle Araujo e Viegas" }),
  teacherUser({ name: "Mrs. Samantha Cardoso", email: "samantha.cardoso@dbce.com", department: "ECS", facultyName: "Mrs. Samantha Cardoso" }),
  teacherUser({ name: "Mrs. Trima Fernandes e Fizardo", email: "trima.fernandes.e.fizardo@dbce.com", department: "ECS", facultyName: "Mrs. Trima Fernandes e Fizardo" }),
  teacherUser({ name: "Mrs. Flavia Leitao", email: "mrs.flavia.leitao@dbce.com", department: "ECS", facultyName: "Mrs. Flavia Leitao" }),
  teacherUser({ name: "Ms. Anisha Cotta", email: "anisha.cotta@dbce.com", department: "ECS", facultyName: "Ms. Anisha Cotta" }),
  teacherUser({ name: "Ms. Avila Naik", email: "avila.naik@dbce.com", department: "SCIENCE AND HUMANITIES", facultyName: "Ms. Avila Naik" }),
  teacherUser({ name: "Ms. Carol Cardozo", email: "carol.cardozo@dbce.com", department: "SCIENCE AND HUMANITIES", facultyName: "Ms. Carol Cardozo" }),
  teacherUser({ name: "Ms. Esta Pereira", email: "esta.pereira@dbce.com", department: "SCIENCE AND HUMANITIES", facultyName: "Ms. Esta Pereira" }),
  teacherUser({ name: "Ms. Genevieve Fernandes", email: "genevieve.fernandes@dbce.com", department: "CIVIL", facultyName: "Ms. Genevieve Fernandes" }),
  teacherUser({ name: "Ms. Jesselyn Muriel Fernandes", email: "jesselyn.muriel.fernandes@dbce.com", department: "SCIENCE AND HUMANITIES", facultyName: "Ms. Jesselyn Muriel Fernandes" }),
  teacherUser({ name: "Ms. Jonessa Freeao", email: "jonessa.freeao@dbce.com", department: "CIVIL", facultyName: "Ms. Jonessa Freeao" }),
  teacherUser({ name: "Ms. Mathilda Colaco", email: "mathilda.colaco@dbce.com", department: "ECS", facultyName: "Ms. Mathilda Colaco" }),
  teacherUser({ name: "Ms. Melba DSouza", email: "melba.dsouza@dbce.com", department: "ECS", facultyName: "Ms. Melba DSouza" }),
  teacherUser({ name: "Ms. Mohini Naik", email: "mohini.naik@dbce.com", department: "ECS", facultyName: "Ms. Mohini Naik" }),
  teacherUser({ name: "Ms. Palosha Pereira", email: "palosha.pereira@dbce.com", department: "SCIENCE AND HUMANITIES", facultyName: "Ms. Palosha Pereira" }),
  teacherUser({ name: "Ms. Prachi Desai", email: "prachi.desai@dbce.com", department: "CIVIL", facultyName: "Ms. Prachi Desai" }),
  teacherUser({ name: "Ms. Vanessa Fernandes", email: "vanessa.fernandes@dbce.com", department: "CIVIL", facultyName: "Ms. Vanessa Fernandes" }),
  teacherUser({ name: "Prof. Akshay Naik", email: "akshay.naik@dbce.com", department: "MECH", facultyName: "Prof. Akshay Naik" }),
  teacherUser({ name: "Prof. B.R. Anirudha", email: "b.r.anirudha@dbce.com", department: "CIVIL", facultyName: "Prof. B.R. Anirudha" }),
  teacherUser({ name: "Prof. Kaushik Pai Fondekar", email: "kaushik.pai.fondekar@dbce.com", department: "CIVIL", facultyName: "Prof. Kaushik Pai Fondekar" }),
  teacherUser({ name: "Prof. Nadya Baracho", email: "nadya.baracho@dbce.com", department: "CIVIL", facultyName: "Prof. Nadya Baracho" }),
  teacherUser({ name: "Prof. Neha Naik", email: "neha.naik@dbce.com", department: "COMP", facultyName: "Prof. Neha Naik" }),
  teacherUser({ name: "Prof. Nitendra Palankar", email: "nitendra.palankar@dbce.com", department: "CIVIL", facultyName: "Prof. Nitendra Palankar" }),
  teacherUser({ name: "Prof. Satyash Kadamkar", email: "satyash.kadamkar@dbce.com", department: "CIVIL", facultyName: "Prof. Satyash Kadamkar" }),
  teacherUser({ name: "Prof. Satyesh Kakodkar", email: "satyesh.kakodkar@dbce.com", department: "CIVIL", facultyName: "Prof. Satyesh Kakodkar" }),
  teacherUser({ name: "Prof. Shruti Jambhale", email: "shruti.jambhale@dbce.com", department: "CIVIL", facultyName: "Prof. Shruti Jambhale" }),
  teacherUser({ name: "Prof. Shubham Jambhale", email: "shubham.jambhale@dbce.com", department: "CIVIL", facultyName: "Prof. Shubham Jambhale" }),
  teacherUser({ name: "Prof. Soumya Fernandes", email: "soumya.fernandes@dbce.com", department: "CIVIL", facultyName: "Prof. Soumya Fernandes" }),
  teacherUser({ name: "Prof. Swapnali Salgaonkar", email: "swapnali.salgaonkar@dbce.com", department: "CIVIL", facultyName: "Prof. Swapnali Salgaonkar" }),
  teacherUser({ name: "Prof. Swaroopa Sail", email: "swaroopa.sail@dbce.com", department: "CIVIL", facultyName: "Prof. Swaroopa Sail" }),
  teacherUser({ name: "Prof. Jeffery Valadares", email: "prof.jeffery.valadares@dbce.com", department: "CIVIL", facultyName: "Prof. Jeffery Valadares" }),
  teacherUser({ name: "Starina Dias", email: "starina.dias@dbce.com", department: "CIVIL", facultyName: "Starina Dias" }),
  teacherUser({ name: "Vaishali Parakhi", email: "vaishali.parakhi@dbce.com", department: "SCIENCE AND HUMANITIES", facultyName: "Vaishali Parakhi" })
];

const facultyDirectoryByName = new Map(
  facultyDirectoryUsers.map((user) => [
    String(user.faculty_name || user.name).trim().toLowerCase(),
    user
  ])
);

module.exports = {
  facultyDirectoryUsers,
  facultyDirectoryByName,
  normalizeDirectoryDepartment
};

import { Github, Linkedin, Award, Users, Heart, Sparkles } from "lucide-react";

// استيراد الصور مباشرة ليقوم Vite بمعالجة مساراتها أوتوماتيكياً
import radwaImg from "../../public/Radwa-Sengr.png";
import ranaImg from "../../public/Rana-Amin.png";
import mariamImg from "../../public/Mariam-Deraz.png";
import bassantImg from "../../public/Bassant-Saleh.png";
import gehadImg from "../../public/Gehad-Fahdy.png";
import teamPhotoImg from "../../public/team-photo.jpg";

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
  github: string;
  linkedin: string;
}

const teamMembers: TeamMember[] = [
  {
    name: "Radwa Sengr",
    role: "Frontend Developer",
    bio: "تطوير واجهات المستخدم التفاعلية وتحسين تجربة المريض بشكل سلس ومريح.",
    image: radwaImg,
    github: "https://github.com/RadwaSengr",
    linkedin: "https://www.linkedin.com/in/radwa-s-2b4079306?utm_source=share_via&utm_content=profile&utm_medium=member_android",
  },
  {
    name: "Rana Amin",
    role: "AI Engineer",
    bio: "تطوير نماذج الذكاء الاصطناعي، بناء الهندسة المعمارية للنظام وربط الواجهات.",
    image: ranaImg,
    github: "https://github.com/Rana719",
    linkedin: "https://www.linkedin.com/in/rana-amin-855085282?utm_source=share_via&utm_content=profile&utm_medium=member_android",
  },
  {
    name: "Mariam Deraz",
    role: "AI & UX Designer",
    bio: "تصميم تجربة المستخدم وتنسيق الهوية البصرية وتسهيل الوصول للمعلومة.",
    image: mariamImg,
    github: "#",
    linkedin: "www.linkedin.com/in/mariam-draz-b54647374",
  },
  {
    name: "Bassant Saleh",
    role: "AI & Safety Engineer",
    bio: "إدارة قواعد البيانات وإعداد البنية التحتية البرمجية وتكامل الـ APIs.",
    image: bassantImg,
    github: "https://github.com/512005",
    linkedin: "https://www.linkedin.com/in/bassant-saleh-812b75315?utm_source=share_campaign=share_via&utm_content=profile&utm_medium=android_app",
  },
  {
    name: "Gehad Fahdy",
    role: "AI & Medical Content Specialist",
    bio: "مراجعة وإعداد المحتوى الطبي الموثوق وتجهيز العرض التقديمي للمشروع.",
    image: gehadImg,
    github: "https://github.com/gehad570",
    linkedin: "https://www.linkedin.com/in/gehad-fahdy-538687319?utm_source=share_via&utm_content=profile&utm_medium=member_android",
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8 text-foreground dir-rtl">
      {/* Header Section */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100 text-pink-700 dark:bg-pink-950/60 dark:text-pink-300 text-xs sm:text-sm font-semibold mb-6 shadow-sm border border-pink-200 dark:border-pink-800">
          <Award className="w-4 h-4 text-pink-600 dark:text-pink-400" />
          <span>Top 5 Finalist at AI Hackathon</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 bg-clip-text text-transparent">
         BreastCancerCare AI - ReNova Team
        </h1>

        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          مساعد ذكي ثنائي اللغة مبني على مصادر علمية موثوقة لمساندة مرضى سرطان الثدي وتوفير التوعية والإرشاد من مرحلة التشخيص وحتى المتابعة بعد العلاج.
        </p>
      </div>

      {/* Group Photo Section */}
      <div className="max-w-4xl mx-auto mb-16 overflow-hidden rounded-3xl border border-border/60 bg-card shadow-lg">
        <div className="ReNova Team">
          <img
            src={teamPhotoImg}
            alt="BreastCancerCare AI Team"
            className="w-full h-64 sm:h-96 object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-6">
            <div className="text-white">
              <div className="flex items-center gap-2 text-pink-300 text-sm font-semibold mb-1">
                <Sparkles className="w-4 h-4" /> AI Hackathon 2026
              </div>
              <p className="text-sm sm:text-base font-medium opacity-90">
                يوم التصفيات النهائية بين أفضل 5 مشاريع مبتكرة.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Members Grid */}
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center gap-2 mb-10">
          <Users className="w-6 h-6 text-pink-600 dark:text-pink-400" />
          <h2 className="text-2xl sm:text-3xl font-bold">Team Members</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="group relative rounded-2xl border border-border/60 bg-card p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md hover:border-pink-500/40 transition-all duration-300"
            >
              <div className="relative mb-4">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full border-2 border-pink-500/30 object-cover shadow-inner group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute bottom-0 right-0 p-1 bg-pink-600 text-white rounded-full shadow">
                  <Heart className="w-3.5 h-3.5 fill-current" />
                </span>
              </div>

              <h3 className="text-lg font-bold text-foreground mb-1">{member.name}</h3>
              <p className="text-xs font-semibold text-pink-600 dark:text-pink-400 mb-3">
                {member.role}
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed mb-6 flex-grow">
                {member.bio}
              </p>

              <div className="flex items-center gap-3 pt-4 border-t border-border/40 w-full justify-center">
                <a
                  href={member.github}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-full border border-border/60 hover:bg-pink-50 dark:hover:bg-pink-950/40 hover:text-pink-600 text-muted-foreground transition-colors"
                  title="GitHub Profile"
                >
                  <Github className="w-4 h-4" />
                </a>
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-full border border-border/60 hover:bg-pink-50 dark:hover:bg-pink-950/40 hover:text-pink-600 text-muted-foreground transition-colors"
                  title="LinkedIn Profile"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
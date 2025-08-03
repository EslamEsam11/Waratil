// src/app/services/reciter-images.ts

// Map to link reader ID to personal photo (all IDs verified from API)
export const reciterImageMap: { [key: string]: string } = {
  '3': 'assets/images/IbrahimAl-Asiri.jfif', // إبراهيم العسيري
  '10': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMbjEt-7s31w-dUnzPTPVj3daLW5sgUdZYPw&s', // أكرم العلاقمي
  '20': 'assets/images/KhaledAl-Jalil.jfif', // خالد الجليل
  '30': 'assets/images/SaadAl-Ghamdi.jfif', // سعد الغامدي
  '51': 'assets/images/AbdulBasitAbdulSamad.png', // عبدالباسط عبدالصمد
  '81': 'assets/images/FaresAbbad.jfif', // فارس عباد
  '86': 'assets/images/NasserAl-Qatami.jpg', // ناصر القطامي
  '92': 'assets/images/YasserAl-Dosari.jfif', // ياسر الدوسري
  '102': 'assets/images/MaherAl-Muaiqly.jfif', // ماهر المعيقلي
  '106': 'assets/images/MohamedEl-Tablawi.jfif', // محمد الطبلاوي
  '107': 'assets/images/MohammedAl-Luhaidan.jfif', // محمد اللحيدان
  '112': 'assets/images/MuhammadSiddiq al-Minshawi.jfif', // محمد صديق المنشاوي
  '123': 'assets/images/MisharyAl-Afasy.jfif', //مشاري العفاسي
  '231': 'assets/images/HazzaAl-Balushi.jfif', // هزاع البلوشي
  '263': 'assets/images/AbdulazizAl-Asiri.jfif', // عبدالعزيز العسيري
  '286': 'assets/images/HassanSaleh.jpg', // حسن صالح
  '245': 'assets/images/MansourAlSalmi.jfif', //منصور السالمي
};

// Default image if no custom image exists
export const defaultReciterImage = 'assets/images/waratil.png';
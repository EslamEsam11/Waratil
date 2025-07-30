// src/app/services/reciter-images.ts

// Map to link reader ID to personal photo (all IDs verified from API)
export const reciterImageMap: { [key: string]: string } = {
  '3': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTvq-Wgp_Wc2oXp9_vEnukSCgGH0Jiy7vG5A&s', // إبراهيم العسيري
  '6': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZQLflRyhktAT-sIRNoVJSbUnRmS79lzRdEw&s', // أحمد الحواشي

  '10': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMbjEt-7s31w-dUnzPTPVj3daLW5sgUdZYPw&s', // أكرم العلاقمي
  '20': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSt9ixy3Go8TJwdo-lQxDITF-DS7scklE88YQ&s', // خالد الجليل
  '30': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHiz3I9GKsGNtGK0c8SF1HOJnmVoWt2OOUjg&s', // سعد الغامدي

  '51': 'https://upload.wikimedia.org/wikipedia/ar/7/73/%D8%B5%D9%88%D8%B1%D8%A9_%D8%B4%D8%AE%D8%B5%D9%8A%D8%A9_%D8%B9%D8%A8%D8%AF_%D8%A7%D9%84%D8%A8%D8%A7%D8%B3%D8%B7_%D8%B9%D8%A8%D8%AF_%D8%A7%D9%84%D8%B5%D9%85%D8%AF.png', // عبدالباسط عبدالصمد

  '81': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwiZrrn0aTKidyxYwXrSf4Zh7vO0L8I0lYdg&s', // فارس عباد
  '86': 'https://yt3.googleusercontent.com/nW3Dbz94zrTgnu330L39oYyaOoSC3nlLoW7az9wM6YM9HNtwqtBjGczisNmq48T0BqfagEvK=s900-c-k-c0x00ffffff-no-rj', // ناصر القطامي
  '92': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRH1sakdZkKRDIG8KJcC-57Ay_CYFJ9_kekiA&s', // ياسر الدوسري

  '100': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxI4GNb1kbKo0-iYOj2eOe2zdOMMxOGRf41PJOhHJsa-cjUSWpyrtj8Fblgry5ZzFPJd0&usqp=CAU', // ماجد العنزي
  '101': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIBd6NwC1U50S3P8vBwmwdg2patAFwCXKm-wY9mj4hXzhr6eqihzF0r3zv_KqvDj02a_c&usqp=CAU', //مالك شيبة الحمد
  '102': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVAPgn6VVccvXipjtf3XUxwhG7hxah14QNnQ&s', // ماهر المعيقلي
  '104': 'https://tvquran.com/uploads/authors/images/%D9%85%D8%AD%D9%85%D8%AF%20%D8%A7%D9%84%D8%A7%D9%8A%D8%B1%D8%A7%D9%88%D9%8A.jpg', // محمد الأيراوي
  '106': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZtySrLzpCnAz3VJiH0D6qk2Uxr-HlNeuaSQ&s', // محمد الطبلاوي
  '107': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoK73DqmKx_37EmlX_jOGPGdPrXJtgo6dN1Q&s', // محمد اللحيدان
  '112': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiNlSRl-b57ZQ5enRH5WxufyXrrJYj_gf0iA&s', // محمد صديق المنشاوي
  '123': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNQqRZZAqftgZ0znpnLDs_GWx6SKK1_GP13w&s', //مشاري العفاسي
  '231': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpjYXTKnuWQPcFCNgCwqpDP50cN0OR698hjQ&s', // هزاع البلوشي
  '263': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdTjlnFkDH6AlnXbShqtEPEUsPQ-kWDr64iw&s', // عبدالعزيز العسيري
  '286': 'https://i1.sndcdn.com/artworks-CMeicyz01Xzne3i8-3HlqjQ-t500x500.jpg', // حسن صالح
};

// Default image if no custom image exists
export const defaultReciterImage = 'https://mostaql.hsoubcdn.com/uploads/portfolios/1210811/623901142f1ca/%D8%B4%D8%B9%D8%A7%D8%B1-%D9%88%D8%B1%D8%AA%D9%843.png';
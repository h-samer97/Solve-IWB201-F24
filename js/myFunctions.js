// أكواد جافاسكرت الأساسية + جي كويري
$(function () { // الدالة الرئيسية الحاوية
  // إخفاء التفاصيل عند تحميل الصفحة
  $('.details').hide();

  // عند تغيير حالة المربع
  // نستخدم حدث OnChange في جي كويري
  $(document).on('change', '.toggle-details', function () {
    var $row = $(this).closest('tr.app-row'); // أستحداف عنصر tr
    var appId = $row.data('app-id'); // وضع خاصية data للتمييز
    // خاصية data في وسوم HTML تسمح بتمييز العناصر عبر اضافة خاصية مميزة
    var $detailsRow = $('tr.details-row[data-details-for="' + appId + '"]');
    var $detailsBox = $detailsRow.find('.details');

    if (this.checked) {
      // دوال التحكم بالسلايد
      $detailsBox.stop(true, true).slideDown(200);
    } else {
      $detailsBox.stop(true, true).slideUp(200);
    }
  });

  // التحقق من صحة النموذج في add_app.html
  $("#appForm").on("submit", function (e) {
    e.preventDefault();

    // تطبيق اجراءات فلترة وتصفية المدخلات التي دخلها المستخدم 
    // مثل المسافات الزائدة بواسطة دالة trim()
    let valid   = true; // تعيين حالة التحقق بقيمة منطقية
    let name    = $("#appName").val()?.trim();
    let company = $("#company").val()?.trim();
    let website = $("#website").val()?.trim();
    let usage   = $("#usage").val();
    let desc    = $("#description").val()?.trim();
    let free    = $("input[name='free']:checked").val();

    // تطبيق قواعد التعابير القياسية في لغة جافاسكربت RegExp
    // تحقق من اسم التطبيق حروف إنجليزية فقط بدون فراغات
    // !true === false ========> عكس الشرط
    if (!/^[A-Za-z]+$/.test(name)) {
      alert("اسم التطبيق يجب أن يحتوي على حروف إنجليزية فقط بدون فراغات");
      valid = false;
    }

    // تحقق من الشركة أحرف إنجليزية مع أرقام
    // إستخدام تقنية التعابير القياسية في جافاسكربت
    if (!/^[A-Za-z0-9]+$/.test(company)) {
      alert("اسم الشركة يجب أن يحتوي على أحرف إنجليزية مع أرقام فقط");
      valid = false;
    }

    // تحقق من الموقع URL
    
    try {
      new URL(website);
    } catch {
      alert("الرجاء إدخال رابط صحيح");
      valid = false;
    }

    // تحقق من مجال الاستخدام
    if (usage === "") {
      alert("الرجاء اختيار مجال الاستخدام");
      valid = false;
    }

    // تحقق من الوصف
    if (desc.length < 10) {
      alert("الشرح المختصر يجب أن يكون أطول من 10 أحرف");
      valid = false;
    }

    // تحقق من مجاني/غير مجاني
    if (!free) {
      alert("الرجاء تحديد إن كان التطبيق مجانيًا أم لا");
      valid = false;
    }

    // تخزين الداتا في localStorage
    // LocalStorage هي كائن يسمح بتخزين البيانات في ذاكرة المتصفح لإسترجاعها لاحقا
    if (valid) {
      // في حال كانت قيمة المتغير valid == true 
      // تحويل الكائن الى نص صرف للتخزين في ذاكرة المتصفح
      localStorage.setItem("newApp", JSON.stringify({
        appName: name,
        company,
        website,
        usage,
        description: desc,
        free
      }));
      window.location.href = "apps.html";
    }
  });

  // عند تحميل صفحة التطبيقات يخزن الصف الجديد في الجدول
  // يتم تخزين عبر كائن Json
  if (window.location.pathname.endsWith("apps.html")) {
    const raw = localStorage.getItem("newApp");
    if (raw) {
      try {
        // يحاول ضم صف جديد وبعدها يحذف هذا الصف من ذاكرة المتصفح
        const app = JSON.parse(raw);
        appendAppRow(app);
        localStorage.removeItem("newApp");
      } catch (e) {
        console.warn("Invalid newApp payload");
      }
    }
  }
});

// دالة لإضافة صف جديد للتطبيق
function appendAppRow(app) {
  const appId = `app-${Date.now()}`;
  const isFreeText = app.free === "yes" ? "مجاني" : "غير مجاني"; // شرط مختصر
  // Short IF ===========> (Condetion) ? true : false;


  // قالب للإضافة
  // نستخدم طريقة جافاسكربت الحديثة ECMASCRPIT
  const rowHtml = `
    <tr class="app-row" data-app-id="${appId}">
      <td>${app.appName}</td>
      <td>${app.company}</td>
      <td>${app.usage}</td>
      <td>${isFreeText}</td>
      <td><input type="checkbox" class="toggle-details" /></td>
    </tr>
    <tr class="details-row" data-details-for="${appId}">
      <td colspan="5">
        <div class="details">
          <div><span class="label">عنوان الموقع الإلكتروني:</span>
            <a href="${app.website}" target="_blank">${app.website}</a>
          </div>
          <div><span class="label">شرح مختصر:</span> ${escapeHtml(app.description)}</div>
          <div><em>لا توجد وسائط مرفقة للتطبيق الجديد.</em></div>
        </div>
      </td>
    </tr>
  `;

  $("#appsTable").append(rowHtml);
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;");
}
/*
+======================================+
+         End This program :)          +
+======================================+
*/
window.onload = function(){
  loadPage('stocks');
}

function loadPage(page){
  $("#mainContent").addClass('d-none');
  $("#mainContent").load(`${page}.html`);

  let isLogin = checkUserLoginState();
  
  setTimeout(function(){
    if(page == 'stocks'){
      getTGSI();
    }

    if(page == 'news'){
      getNews();
      if(isLogin){
        unlockNews();
      }
    }

    if(page == 'member'){
      if(!isLogin){
        $('#acnt').on('input', function(){
          this.value = this.value.replace(/[^A-Za-z0-9]/g, '');
        });
      }
      else{
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user')
        if (token) {
          $('#memberTitle').text('會員頁面');
          $('#loginForm').addClass('d-none');
          $('#userName').text(`${user}`);
          $('#userInfo').removeClass('d-none');
        }
      }
    }
    $("#mainContent").removeClass('d-none');
  }, 200);
  
}

function checkUserLoginState(){
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user')
  if (token) { globalUserCheck
    $('#globalUserCheck').text(`Hi,${user}`);
    return true;
  }
  else{
    $('#globalUserCheck').text(`尚未登入`);
    return false;
  }
}

function logOut(){
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  let islogin = checkUserLoginState();
  if(!islogin){
    $('#memberTitle').text('會員註冊/登入');
    $('#loginForm').removeClass('d-none');
    $('#userInfo').addClass('d-none');
  }
}

function userRegist(){
  const acnt = $('#acnt').val();
  const pwd = $('#pwd').val();
  if(!acnt || !pwd){
    alert(`帳號或密碼不能為空`);
    return;
  }
  $.ajax({
    url: `http://localhost:3000/api/Regist`,
    type: "POST",
    dataType: "json",
    contentType: 'application/json',
    data: JSON.stringify({
      acnt:acnt,
      pwd:pwd
    }),
    success:function(response){
      alert(`註冊成功，請登入`)
    },
    error: function(err) {
      if(err.status == 421){
        alert(`無可用資料庫: ${err.responseText}`);
      }
      if(err.status == 422){
        alert(`查詢錯誤: ${err.responseText}`);
      }
      if(err.status == 423){
        alert(`帳號已被註冊: ${err.responseText}`);
      }
      if(err.status == 424){
        alert(`無法新增帳號: ${err.responseText}`);
      }
      if(err.status == 500){
        alert(`${err.responseText}`);
      }
    }
  })
}

function userLogin(){
  $('#serverinfo_Member').addClass('d-none');
  const acnt = $('#acnt').val();
  const pwd = $('#pwd').val();
  if(!acnt || !pwd){
    alert(`帳號或密碼不能為空`);
    return;
  }
  $.ajax({
    url: `http://localhost:3000/api/Login`,
    type: "POST",
    dataType: "json",
    contentType: 'application/json',
    data:JSON.stringify({acnt:acnt,pwd:pwd}),
    success:function(response){
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', response.user.acnt);
      loadPage('member');
    },
    error: function(err) {
      if(err.status == 0){
        $('#serverinfo_Member').removeClass('d-none');
      }
      if(err.status == 421){
        alert(`無可用資料庫: ${err.responseText}`);
      }
      if(err.status == 422){
        alert(`查詢錯誤: ${err.responseText}`);
      }
      if(err.status == 425){
        alert(`該帳號尚未註冊: ${err.responseText}`);
      }
      if(err.status == 500){
        alert(`${err.responseText}`);
      }
    }
  })
}

function convertRate(){
  $('#serverinfo_Forex').addClass('d-none');
  const fromC = $('#fromCurrency').val();
  const toC = $('#toCurrency').val();
  
  $.ajax({
    url: `http://localhost:3000/api/Currency`,
    type: "GET",
    dataType: "json",
    data:{fromC:fromC,toC:toC},
    success:function(response){
      const rate = response.rate;
      let amount = Number($(`#ipFromCurrency`).val());
      if(!amount) amount = 1;
      $(`#Result`).val((amount * rate).toFixed(3));
    },
    error: function(err) {
      if(err.status == 0){
        $('#serverinfo_Forex').removeClass('d-none');
      }
    }
  })
}

function getTGSI(){
  $('#serverinfo_Stock').addClass('d-none');
  const dict = [
    { symbol: '000001.SS', id: 'cs1' },
    { symbol: '399001.SZ', id: 'cs2' },
    { symbol: '^HSI', id: 'cs3' },
    { symbol: '^GSPC', id: 'us1' },
    { symbol: '^IXIC', id: 'us2' },
    { symbol: '^DJI', id: 'us3' },
    { symbol: '^FTSE', id: 'es1' },
    { symbol: '^GDAXI', id: 'es2' },
    { symbol: '^FCHI', id: 'es3' }
  ];
  dict.forEach(({symbol, id}) => {
    $.ajax({
      url: `http://localhost:3000/api/TGSI`,
      type: "GET",
      dataType: "json",
      data:{symbol:symbol},
      success: function(response) {
        $(`#${id}_regularMarketPrice`).text(response.regularMarketPrice).addClass(response.regularMarketPrice > 0 ? "text-success":"text-danger");
        $(`#${id}_regularMarketChange`).text(response.regularMarketChange).addClass(response.regularMarketChange > 0 ? "text-success": response.regularMarketChange = 0 ? "text-white":"text-danger");;
        $(`#${id}_regularMarketChangePercent`).text(response.regularMarketChangePercent.toFixed(3) + "%").addClass(response.regularMarketChangePercent > 0 ? "text-success":"text-danger");
        $(`#${id}_regularMarketOpen`).text(response.regularMarketOpen).addClass(response.regularMarketOpen > response.regularMarketPreviousClose ? "text-success":"text-danger");
        $(`#${id}_regularMarketPreviousClose`).text(response.regularMarketPreviousClose).addClass(response.regularMarketPreviousClose > response.regularMarketOpen ? "text-success":"text-danger");
        $(`#${id}_regularMarketDayHigh`).text(response.regularMarketDayHigh).addClass("text-success");
        $(`#${id}_regularMarketDayLow`).text(response.regularMarketDayLow).addClass("text-danger");
        $(`#${id}_regularMarketVolume`).text(response.regularMarketVolume).addClass("text-warning");
        $(`#${id}_regularMarketTime`).text(new Date(response.regularMarketTime).toLocaleString());
      },
      error: function(err) {
        if(err.status == 0){
          $('#serverinfo_Stock').removeClass('d-none');
        }
      }
    });    
  });
}

const newsAPI = '5541451f21d74f9a9edb797872993556';
function getNews(){
  const newsFrom = [`https://newsapi.org/v2/top-headlines?sources=techcrunch`,`https://newsapi.org/v2/top-headlines?country=us&category=business`,`https://newsapi.org/v2/everything?domains=wsj.com`]
  let targetNews = newsFrom[Math.floor(Math.random() * newsFrom.length)];
  $.ajax({
    url: `${targetNews}&apiKey=${newsAPI}`,
    type: "GET",
    dataType: "json",
    success: function(response) {
      articles = response.articles
        .sort(() => Math.random() - 0.5)
        .slice(0, 10);
      
      articles.forEach(article =>{
        $('#myCarouselInner').append(
          `<div class="carousel-item" id="myCarousel">
              <img class="carousel-img d-block" src="${article.urlToImage ?? `${getDefaultImg(targetNews)}`}">
              <div class="container p-2 ">
                  <div class="carousel-caption text-center myCarousel rounded-5">
                      <h1 class="">
                          ${article.title ?? ''};
                      </h1>
                      <p>${article.description ?? ''}</p>
                      <p><a class="btn btn-lg btn-primary" href="${article.url ?? 'link not available'}">To WebSite</a></p>
                  </div>
              </div>
          </div>`)
      });
      $(`#myCarousel`).first().addClass('active');
      $('#carouselSlide').on('slide.bs.carousel',function(e){
        setTimeout(function(){
          $('#carouselSlide .carousel-item.active .carousel-caption.myCarousel')[0].scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }, 100);
      })
    },
    error: function(err) {
      console.error('Error:', JSON.stringify(err));
    }
  });
}

function getDefaultImg(site){
  if(site == 'https://newsapi.org/v2/top-headlines?country=us&category=business') return 'imgs/USN.png';
  if(site == 'https://newsapi.org/v2/top-headlines?sources=techcrunch') return 'imgs/TC.png';
  if(site == 'https://newsapi.org/v2/everything?domains=wsj.com') return 'imgs/WSJ.png';
}

function unlockNews(){
  $('#blocker').addClass('d-none');
  $('#news_vip').removeClass('d-none');
}
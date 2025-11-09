const track = document.querySelector('.carousel-track');
const items = document.querySelectorAll('.carousel-item');
let index = 0;

function moveCarousel() {
  index++;
  if (index >= items.length) {
    index = 0;
  }

  // 각 아이템의 실제 너비를 실시간으로 계산 (브라우저 크기 변경에 대응)
  const itemWidth = items[0].getBoundingClientRect().width;
  const distance = index * itemWidth;

  track.style.transform = `translateX(-${distance}px)`;
}

// 3초마다 이동
setInterval(moveCarousel, 3000);

// 창 크기 바뀌면 위치 재조정 (반응형)
window.addEventListener('resize', () => {
  const itemWidth = items[0].getBoundingClientRect().width;
  const distance = index * itemWidth;
  track.style.transform = `translateX(-${distance}px)`;
});


//콘텐츠 선택
const boxes = document.querySelectorAll('.box');
const contents = document.querySelectorAll('.content');

boxes.forEach(box => {
    box.addEventListener('click', () => {
        const target = box.dataset.target;

        // 모든 콘텐츠 숨기기
        contents.forEach(content => content.classList.remove('active'));

        // 클릭된 버튼과 data-content가 일치하는 콘텐츠만 표시
        contents.forEach(content => {
            if(content.dataset.content === target){
                content.classList.add('active');
            }
        });

        // 박스 활성화 스타일
        boxes.forEach(b => b.classList.remove('active'));
        box.classList.add('active');
    });
});

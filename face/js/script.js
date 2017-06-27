const wrapper = document.querySelector(".wrapper");

//const face = document.querySelector(".face");
const letter = document.querySelector(".letter");
const works = document.querySelector(".works");
const contact = document.querySelector(".contact");

const showGuts = function (block) {

	const mainClassName = block.classList[1];
	const innerEl = document.querySelector(`.${mainClassName} > article`);

	if (innerEl.style.height) {//console.log(innerEl.style, block);
		setTimeout(() => {
			innerEl.style.height = "";
			innerEl.style.opacity = "";
		}, 100);
		innerEl.style.display = "";
	} else {
		setTimeout(() => {
			innerEl.style.height = "auto";
			innerEl.style.opacity = 1;			
		}, 100);
		innerEl.style.display = "block";
	}
}

const unfold = function (e) {

	const element = e.target;
	const children = wrapper.children;

	console.log(element);
	
	[...children].some(item => {
		if(!item.classList.contains('active-section')){
			element.classList.toggle('active-section');
			//innerEl.classList.toggle('visible-info');
			showGuts(element);		
		} else if (item === element) {console.log(item, element, 'ok');
			item.classList.toggle('active-section');
			showGuts(element);
		} else {
			item.classList.toggle('active-section');
			element.classList.toggle('active-section');
			showGuts(item);
			showGuts(element);
		}
	})

	// switch(element) {
	// 	case letter : {
	// 		showGuts(letter);
	// 		break;
	// 	}
	// }

	//wrapper.style.width = "40vw";
	// [face, letter, works, contact].map(item => {
	// 	item.style.height = "200px";
	// })
	//wrapper.style.height = "500px";
}

wrapper.addEventListener('click', unfold);

(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;

        // Searches UNSPLASH.com for the image and adds it to the web page.
	    const imgRequest = new XMLHttpRequest();
		imgRequest.onload = addImage;
		imgRequest.onerror = function (err) {
			requestError(err,'image');
		};
		imgRequest.open('GET', `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`);
		imgRequest.setRequestHeader('Authorization', 'Client-ID 49fafd545b4229485140ae2c2a20916dae8a6def2684760c7010044e24104cbe');
		imgRequest.send();

		function addImage(){
			let htmlContent = '';
			const data = JSON.parse(this.responseText);

			if (data && data.results && data.results[0]) {
				const firstImage = data.results[0];
				htmlContent = `<figure>
					<img src="${firstImage.urls.regular}" alt="${searchedForText}">
					<figcaption>${searchedForText} by ${firstImage.user.name}, ${firstImage.likes} likes</figcaption>
				</figure>`;
			} else {
				htmlContent == '<div class="error-no-image">No images available</div>';
			}

			responseContainer.insertAdjacentHTML('afterbegin', htmlContent);
		}

		// Searches NYTIMES.com for an article and adds it to the web page.
		function addArticles () {
			let htmlContent = '';
			const data = JSON.parse(this.responseText);
			console.log("GC begins",data,"GC ends");
			//debugger;

			htmlContent = `<div class="article">
				<h2><a href="${data.response.docs[1].web_url}" target="_blank">${data.response.docs[1].headline.main}</a></h2>
				<p>${data.response.docs[1].snippet}</p>
			</div>`;

			responseContainer.insertAdjacentHTML('beforeend', htmlContent);
		}

		const articleRequest = new XMLHttpRequest();
		articleRequest.onload = addArticles;
		articleRequest.open('GET', `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=e35e661abcd54895b4b2842465fb67a0`);
		articleRequest.send();

    });
})();

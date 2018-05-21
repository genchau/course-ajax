(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;



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

		
		function addArticles () {
			let htmlContent = '';
			const data = JSON.parse(this.responseText);

			if (data.response && data.response.docs && data.response.docs.length > 1) {
				htmlContent = '<ul>'+ 
					data.response.docs.map(artNYTimes => `<li class="article">
						<h2><a href="${artNYTimes.web_url}" target="_blank">${artNYTimes.headline.main}</a></h2>
						<p>${artNYTimes.snippet}</p>
					</li>`
				).join('') + '</ul>';
			} else {
				htmlContent = '<div class="error-no-articles">No articles available</div>';
			}

			responseContainer.insertAdjacentHTML('beforeend', htmlContent);
		}

        // Searches UNSPLASH.com for the image and adds it to the web page.
	    const imgRequest = new XMLHttpRequest();
		imgRequest.onload = addImage;
		imgRequest.onerror = function (err) {
			requestError(err,'image');
		};
		imgRequest.open('GET', `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`);
		imgRequest.setRequestHeader('Authorization', 'Client-ID 49fafd545b4229485140ae2c2a20916dae8a6def2684760c7010044e24104cbe');
		imgRequest.send();

		// Searches NYTIMES.com for an article and adds it to the web page.
		const articleRequest = new XMLHttpRequest();
		articleRequest.onload = addArticles;
		articleRequest.open('GET', `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=e35e661abcd54895b4b2842465fb67a0`);
		articleRequest.send();

    });
})();

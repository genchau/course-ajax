/* eslint-env jquery */

(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;


		function addImage(data) {
		    let htmlContent = '';
		    const firstImage = data.results[0];

		    if (firstImage) {
		        htmlContent = 
		        `<figure>
		    		<img src="${firstImage.urls.small}" alt="${searchedForText}">
		    		<figcaption>${searchedForText} by ${firstImage.user.name}, ${firstImage.likes} likes</figcaption>
		    	</figure>`;
		    } else {
		        htmlContent = '<div class="error-no-image">No images available</div>'
		    }

		    responseContainer.insertAdjacentHTML('afterbegin', htmlContent);
		}

        function addArticles(articles) {
        	let htmlContent = '';

        	if (articles.response.docs.length > 0) {
        		htmlContent = 
        		'<ul>\n' +
        			articles.response.docs.map(articlesNYTimes => 
        				`<li class="article">
        					<h2><a href="${articlesNYTimes.web_url}" target="_blank">${articlesNYTimes.headline.main}</a></h2>
        					<p>${articlesNYTimes.snippet}</p>
        				</li>`)
        			.join('\n') +
        		'\n</ul>';
        	} else {
        		htmlContent = '<div class="error-no-articles">No articles available</div>';
        	}

        	responseContainer.insertAdjacentHTML('beforeend', htmlContent);
        }

        function requestError(e, part) {
        	console.log(e);
        	responseContainer.insertAdjacentHTML('afterbegin', `<p class="network-warning error-no-${part}">Oh no! There was an error making a request for the ${part}.</p>`);
        }

        fetch(`https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`, {
        	headers: {
        		'Authorization': 'Client-ID 611dc2767c8fcc33f0013f0c03634373b5c864669a77f37b7133f9377bf52f8e'
        	}
        }).then(response => response.json())
        .then(addImage)
        .catch(e => requestError(e, 'image'));

        fetch(`https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=e35e661abcd54895b4b2842465fb67a0`)
        .then(response => response.json())
        .then(addArticles)
        .catch(e => requestError(e, 'articles'));    

    });
})();

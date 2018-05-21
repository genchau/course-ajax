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

        function addImage(images) {
        	console.log(images);// TODO_REMOVE
        	const firstImage = images.results[0];

        	if (images.results.length>0){
		    	responseContainer.insertAdjacentHTML('afterbegin', 
		    		`<figure>
		    		<img src="${firstImage.urls.small}" alt="${searchedForText}">
		    		<figcaption>${searchedForText} by ${firstImage.user.name}, ${firstImage.likes} likes</figcaption>
		    		</figure>`
		    	);
        	} else {
        		responseContainer.insertAdjacentHTML('afterbegin', 
        			'<div class="error-no-image">No images available</div>'
        		)
        	}
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

    	$.ajax({
    		url: `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`,
    		headers: {
    			Authorization: 'Client-ID 611dc2767c8fcc33f0013f0c03634373b5c864669a77f37b7133f9377bf52f8e'
    		}
    	}).done(addImage)
    	.fail(function(err) {
    		console.log("GC Error getting data from unsplash");
    		requestError(err, 'image');
    		console.log("GC requestError image activated");
    	});

    	$.ajax({
    		url: `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=e35e661abcd54895b4b2842465fb67a0`,
    	}).done(addArticles)
    	.fail(function(err) {
    		console.log("GC Error getting data from NY Times");
    		requestError(err, 'articles');
    		console.log("GC requestError articles activated");
    	});

    });
})();

function createPostElement(post) {

    let postElement = document.createElement("div");
    postElement.className = "card";

    let postBody = document.createElement("div");
    postBody.id = `PostBody${post.id}`;
    postBody.className = "card-body";

    let postTitle = document.createElement("h6");
    postTitle.className = "card-title"
    postTitle.style.marginBlockEnd = "0px";

    let postAnchor = document.createElement("a");
    postAnchor.innerHTML = `@${post.user}`;
    postAnchor.href = `/profile/${post.user}`;
    postAnchor.style.color = "black";

    postTitle.append(postAnchor);

    let postTimestamp = document.createElement("small");
    postTimestamp.className = "card-text text-muted";
    postTimestamp.innerHTML = `${post.timestamp}`;

    let postText = document.createElement("p");
    postText.id = `PostText${post.id}`;
    postText.className = "card-text";
    postText.style.marginBlockStart = "8px";
    postText.innerHTML = post.text;

    postBody.append(postTitle, postTimestamp, postText);

// If user is authenticated, add like button
if (userIsAuthenticated) {
    let postLikeButton = createLikeButton(post);
    postBody.append(postLikeButton);
}

    // If user is post's creator, add edit button
    isCreatorGET(post.id)
    .then(isCreator => {
        if(isCreator.iscreator) {
            let postEditButton = createEditButton(post);
            postBody.append(postEditButton);
        } 
    });

    postElement.append(postBody);

    return postElement;

}

function createLikeButton(post) {
    let likeButton = document.createElement("button");
    likeButton.style.marginRight = "10px";
    likeButton.id = `PostLikeButton${post.id}`;

    // Check if the post's like state is stored in localStorage
    const storedLikeState = localStorage.getItem(`post_${post.id}_like_state`);
    const storedLikeCount = localStorage.getItem(`post_${post.id}_like_count`);

    // Use stored values if available, otherwise fetch from the server
    if (storedLikeState && storedLikeCount) {
        // Parse stored values
        let likeState = JSON.parse(storedLikeState);
        let likeCount = parseInt(storedLikeCount);

        // Set the button state based on stored like state
        if (likeState) {
            likeButton.className = "btn btn-sm btn-primary";  // Liked state
            likeButton.innerHTML = `<i class="bi bi-heart-fill"></i> ${likeCount}`;
            likeButton.onclick = () => { unlike(post.id, `#${likeButton.id}`); };
        } else {
            likeButton.className = "btn btn-sm btn-primary";  // Not liked state
            likeButton.innerHTML = `<i class="bi bi-heart"></i> ${likeCount}`;
            likeButton.onclick = () => { like(post.id, `#${likeButton.id}`); };
        }
    } else {
        // Fetch from server if no stored values are found
        isLikedGET(post.id).then(isliked => {
            if (isliked) {
                let likeCount = isliked.likes_count || 0;  // Default to 0 if likes_count is not available
                if (isliked.liked) {
                    likeButton.className = "btn btn-sm btn-primary";
                    likeButton.innerHTML = `<i class="bi bi-heart-fill"></i> ${likeCount}`;
                    likeButton.onclick = () => { unlike(post.id, `#${likeButton.id}`); };
                    // Store in localStorage
                    localStorage.setItem(`post_${post.id}_like_state`, JSON.stringify(true));
                    localStorage.setItem(`post_${post.id}_like_count`, likeCount);
                } else {
                    likeButton.className = "btn btn-sm btn-primary";
                    likeButton.innerHTML = `<i class="bi bi-heart"></i> ${likeCount}`;
                    likeButton.onclick = () => { like(post.id, `#${likeButton.id}`); };
                    // Store in localStorage
                    localStorage.setItem(`post_${post.id}_like_state`, JSON.stringify(false));
                    localStorage.setItem(`post_${post.id}_like_count`, likeCount);
                }
            }
        }).catch(error => {
            console.error('Error fetching like status:', error);
            likeButton.className = "btn btn-sm btn-primary";
            likeButton.innerHTML = `<i class="bi bi-heart"></i> 0`;
            likeButton.onclick = () => { like(post.id, `#${likeButton.id}`); };
        });
    }

    return likeButton;
}





function createPagination(pageCurrent, paginationContainerId, postsContainerId, username = "", following = false) {

    let paginationContainer = document.querySelector(paginationContainerId);
    paginationContainer.innerHTML = "";

    countPostsGET(username, following)
    .then(count => {

        // Calculate total number of pages
        let pageCount = Math.ceil(count.posts_count/postsIncrement);

        paginationList = document.createElement("ul");
        paginationList.className = "pagination justify-content-center";
        paginationList.id = "PaginationList";

        // For every page
        for(let page = 1; page < pageCount + 1; page++) {

            let pageItem = document.createElement("li");
            pageItem.className = "page-item";

            let pageItemButton = document.createElement("button");
            pageItemButton.className = page == pageCurrent? "btn btn-primary": "btn btn-light";
            pageItemButton.id = `PageButton${page}`;
            pageItemButton.innerHTML = `${page}`;
            
            // Add 'onlclick' event handler to go to page 
            pageItemButton.addEventListener("click", () => {
                pageCurrent = page;
                // Load posts for the page  
                loadPosts(page, postsContainerId, username, following);
                // Update pagination
                createPagination(pageCurrent, paginationContainerId, postsContainerId, username, following);
            });

            pageItem.append(pageItemButton);

            paginationList.append(pageItem);

        }

        // Add Next button if there is more than one page and current page is not last page
        if (pageCount > 1 && pageCurrent < pageCount) {

            let pageNextButton = document.createElement("button");
            pageNextButton.className = "btn btn-light";
            pageNextButton.id = "PageButtonNext";
            pageNextButton.innerHTML = "Next";

            // Add 'onlclick' event handler to go to next page
            pageNextButton.addEventListener("click", () => {
                pageCurrent++;
                // Load posts for the next page  
                loadPosts(pageCurrent, postsContainerId, username, following);
                // Update pagination
                createPagination(pageCurrent, paginationContainerId, postsContainerId, username, following);
            });

            paginationList.append(pageNextButton);
        }

        // Add Previous button if current page is not the first one
        if (pageCurrent > 1) {

            let pagePrevButton = document.createElement("button");
            pagePrevButton.className = "btn btn-light";
            pagePrevButton.id = "PagePrevNext";
            pagePrevButton.innerHTML = "Previous";

            // Add 'onlclick' event handler to go to previous page
            pagePrevButton.addEventListener("click", () => {
                pageCurrent--;
                // Load posts for the previuos page  
                loadPosts(pageCurrent, postsContainerId, username, following);
                // Update pagination
                createPagination(pageCurrent, paginationContainerId, postsContainerId, username, following);
            });

            paginationList.prepend(pagePrevButton);
        }

        paginationContainer.append(paginationList);

    });

}
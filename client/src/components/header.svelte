<script>
  import { Link, navigate } from "svelte-routing";
  import authStore from "../stores/authStore";
  import SearchBar from "./searchBar.svelte"

  let expanded = false;
  let showCategories = false;
  $: userLoggedIn = $authStore.userToken;
  $: isAdmin = $authStore.isAdmin;
  let selectedCategory = null;

  const handleCategoryClick = (category) => {
    selectedCategory = category;   
  };
  
  const handleIconClick = () => {
    if (userLoggedIn) {
      navigate(isAdmin ? "/admins/me" : "/users/me");
    } else {
      navigate("/login");
    }
  };
  const toggleCategories = () => {
    showCategories = !showCategories;
  };

  const closeCategories = () => {
    showCategories = false;
  };

  const categories = [
    'Romance',
    'Science',
    'Adventure',
    'Fantasy',
    'Friction',
    'History',
    'Literature',
    'Mystery'
  ];

</script>

<nav class="navbar navbar-expand-lg navbar-light">
  <div class="container-fluid">
    <Link to="/" class="navbar-brand">BookLender</Link>
    <button class="navbar-toggler" type="button" on:click={() => expanded = !expanded}>
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class={expanded ? "navbar-collapse show" : "navbar-collapse"} id="navbarSupportedContent">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item active">
          <Link to="/" class="nav-link">Home</Link>
        </li>
        <li class="nav-item">
          <Link to="/books" class="nav-link">Books</Link>
        </li>
        <li class="nav-item">
          <button class="nav-link dropdown-toggle" on:click={toggleCategories}>Categories</button>
          {#if showCategories}
            <div class="categories-dropdown" on:mouseleave={closeCategories}>
              {#each categories as category (category)}
              <Link to={`/books/category/${category}`} on:click={() => handleCategoryClick(category)} class="dropdown-item p-2">{category}</Link>
    {/each}
            </div>
          {/if}
        </li>
        <li class="nav-item">
          <Link to="/about" class="nav-link">About</Link>
        </li>
        <li class="nav-item">
          <Link to="/contact" class="nav-link">Contact</Link>
        </li>
      </ul>
      <div class="search-bar">
        <SearchBar />
      </div>
      <div class="login-register-buttons">
        {#if userLoggedIn}
          <i class="bi bi-person" on:click={handleIconClick}></i>
        {:else}
          <Link to="/login" class="btn btn-outline-dark" type="button">Login</Link>
          <Link to="/users" class="btn btn-outline-dark" type="button">Register</Link>
        {/if}
      </div>
    </div>
  </div>
</nav>

<style>
    .navbar {
        background-color: #ffffff;
    }

    .navbar-nav {
        margin: 0 auto;
    }

    .navbar-nav .nav-item {
        text-align: center;
    }

    .search-bar {
        margin-left: auto; /* Move search bar to the right */
    }

    .login-register-buttons {
        margin-left: 10px; /* Add some space between search bar and buttons */
    }

    .bi-person {
        color: #343a40;
        margin-right: 10px;
    }

    .navbar-collapse {
    display: none;
  }

  .navbar-collapse.show {
    display: block;
  }
  .categories-dropdown {
    position: absolute;
    background-color: #fff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    z-index: 1;
    width: 200px;
  }
</style>

<script>
  import queryString from "query-string";
  import parse from "url-parse";

  const query = queryString.parse(location.search);
  const action = JSON.parse(window.decodeURI(query.q));
  const whitelists = ["dev.opencerts.io", "opencerts.io", "tradetrust.io"];
  let valid;
  let timer = 3;
  let interval;

  // use parse to ignore protocols, path, etc...
  $: valid = whitelists.includes(parse(action.payload.redirect).hostname);

  $: if (valid && !interval) {
    interval = setInterval(() => {
      timer--;
    }, 1000);
  }
  $: if (timer === 0) {
    window.location.href = `${action.payload.redirect}${location.search}`
  }
</script>

<style>
  .container {
    display: flex;
    align-items: center;
    flex-direction: column;
  }
  .container > div {
    max-width: 90%;
  }
  .img-container {
    text-align: center;
  }
  .icon {
    width: 200px;
  }
  .text {
    font-size: 2rem;
  }
</style>

<main>
  {#if valid}
    <div class="container">
      <div class="img-container">
        <img src="./send.svg" class="icon" alt="redirect" />
      </div>
      <div class="text">Redirecting to {action.payload.redirect} in {timer}</div>
    </div>
  {:else}
    <div class="container">
      <div class="img-container">
        <img src="./x-octagon.svg" class="icon" alt="redirect" />
      </div>
      <div class="text">{action.payload.redirect} is not an authorized platform by open-attestation.</div>
    </div>
  {/if}
</main>

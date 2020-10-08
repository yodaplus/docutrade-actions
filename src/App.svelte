<script>
  import queryString from "query-string";
  import parse from "url-parse";

  const query = queryString.parse(location.search);
  const action = JSON.parse(window.decodeURI(query.q));
  const whitelists = ["opencerts.io", "tradetrust.io", "gov.sg"];
  let valid;
  let timer = 3;
  let interval;

  const getDomain = hostname => {
    const parts = hostname.split(".").reverse();
    return parts[1] + "." + parts[0];
  };

  // use parse to ignore protocols, path, etc...
  $: valid = action.payload.redirect && whitelists.includes(getDomain(parse(action.payload.redirect).hostname));

  $: if (valid && !interval) {
    interval = setInterval(() => {
      timer--;
    }, 1000);
  }
  $: if (timer === 0) {
    clearInterval(interval);
    window.location.href = `${action.payload.redirect}${location.search}`;
  }
  /**
   *
  https://action.openattestation.com/?q=%7B%22type%22:%22DOCUMENT%22,%22payload%22:%7B%22uri%22:%22https://api.myjson.com/bins/1a9acm%22,%22key%22:%221b8c334a38f9ff96108303a4ba0cc592f1559eb24f5b48b70c9300c60a34d5e9%22,%22permittedAction%22:%5B%22STORE%22%5D,%22redirect%22:%22https://dev.opencerts.io%22%7D%7D
   */
</script>

<style>
  .container {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
  .container > div {
    max-width: 90%;
  }
  .img-container {
    text-align: center;
  }
  .icon {
    width: 50vw;
    min-width: 200px;
    max-width: 600px;
  }
  .text {
    text-align: center;
    font-size: 1.5rem;
  }
  .error {
    color: #ff6584;
    font-weight: 500;
  }
  .success {
    color: #6c63ff;
    font-weight: 500;
  }
</style>

<main>
  {#if valid}
    <div class="container">
      <div class="text">
        Redirecting to
        <span class="success">{action.payload.redirect}</span>
        in {timer}
      </div>
      <div class="img-container">
        <img src="./undraw_online_transactions_02ka.png" class="icon" alt="redirect" />
      </div>
    </div>
  {:else}
    <div class="container">
      <div class="text">
        {#if action.payload.redirect}
          <span class="error">{action.payload.redirect}</span>
          <br />
          is not an authorized platform.
        {:else}
          <span class="error">No platform specified</span>
        {/if}
      </div>
      <div class="img-container">
        <img src="./undraw_cancel_u1it.png" class="icon" alt="redirect" />
      </div>
    </div>
  {/if}
</main>

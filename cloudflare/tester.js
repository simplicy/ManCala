addEventListener("fetch", (event) => {
    event.respondWith(
      handleRequest(event.request).catch(
        (err) => new Response(err.stack, { status: 500 })
      )
    );
  });
  
  /**
   * Many more examples available at:
   *   https://developers.cloudflare.com/workers/examples
   * @param {Request} request
   * @returns {Promise<Response>}
   */
  async function handleRequest(request) {
    const { pathname } = new URL(request.url);
  
    if (pathname.startsWith("/api")) {
      return new Response(JSON.stringify({ pathname }), {
        headers: { "Content-Type": "application/json" },
      });
    }
  
    if (pathname.startsWith("/status")) {
      const httpStatusCode = Number(pathname.split("/")[2]);
  
      return Number.isInteger(httpStatusCode)
        ? fetch("https://http.cat/" + httpStatusCode)
        : new Response("That's not a valid HTTP status code.");
    }
    if (pathname.startsWith("/api/events")) {
      return hello();
    }
  
    return fetch("https://welcome.developers.workers.dev");
  }
  
  function hello(){
    const data = {
      hello: "world",
      more: "data"
  
    }
  
    const json = JSON.stringify(data)
  
    return new Response(json, {
        headers: {
          "content-type": "application/json;"
        }
      })  
  }
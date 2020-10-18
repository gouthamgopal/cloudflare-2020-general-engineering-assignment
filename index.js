addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

links = [
  {
    name: 'My Github Profile',
    url: 'https://www.github.com/gouthamgopal',
  },
  {
    name: 'My LinkedIn Profile',
    url: 'https://www.linkedin.com/in/goutham-gopal-8a018692/',
  },
  {
    name: 'Cloudflare Worker Docs',
    url: 'https://developers.cloudflare.com/workers/',
  },
]

/**
 * Helper class to modify the elements of fetched HTML.
 * @param {String} type type of action required for the element.
 */
class PageModifier {
  constructor(type) {
    this.action = type
    this.links = links
  }

  async element(element) {
    switch (this.action) {
      case 'links':
        this.links.forEach(item => {
          element.append(`<a href="${item.url}">${item.name}</a>`, {
            html: true,
          })
        })
        break
      case 'profile':
        element.removeAttribute('style')
        break
      case 'name':
        element.setInnerContent('Goutham Gopal')
        break
      case 'avatar':
        element.setAttribute(
          'src',
          'https://raw.githubusercontent.com/gouthamgopal/cloudflare-2020-general-engineering-assignment/main/img2.jpg',
        )
        break
      case 'social':
        element.removeAttribute('style')
        element.append(
          `<a href="https://www.linkedin.com/in/goutham-gopal-8a018692/"><img src='https://www.flaticon.com/premium-icon/icons/svg/3256/3256016.svg' style="width:30px; height: 30px"/></a>`,
          { html: true },
        )
        element.append(
          `<a href="https://www.github.com/gouthamgopal"><img src='https://www.flaticon.com/svg/static/icons/svg/25/25657.svg' style="width:30px; height: 30px"/></a>`,
          { html: true },
        )
        break
      case 'title':
        element.setInnerContent('Goutham Gopal')
        break
      case 'body':
        element.setAttribute('class', 'bg-blue-400')
        break
      default:
        break
    }
  }
}

/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {
  const url = new URL(request.url)

  let path = url.pathname.split('/')

  if (path[1] === 'links') {
    payload = 'Response \n\n' + JSON.stringify(links, null, 4)
    return new Response(payload, {
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
    })
  } else {
    const options = {
      headers: {
        'content-type': 'text/html;charset=UTF-8',
      },
    }
    const response = await fetch(
      'https://static-links-page.signalnerve.workers.dev/',
      options,
    )

    return new HTMLRewriter()
      .on('div#links', new PageModifier('links'))
      .on('div#profile', new PageModifier('profile'))
      .on('h1#name', new PageModifier('name'))
      .on('img#avatar', new PageModifier('avatar'))
      .on('div#social', new PageModifier('social'))
      .on('title', new PageModifier('title'))
      .on('body', new PageModifier('body'))
      .transform(response)
  }
}

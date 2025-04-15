import { http, HttpResponse } from 'msw'

export const handlers = [
  // Intercept "GET https://example.com/user" requests...
  http.get('/api/table', async ({ request, requestId, cookies }) => {
    const url = new URL(request.url)
    url.searchParams.get('page')
    const x = await request.json()
    console.log(x, requestId, cookies)
    return HttpResponse.json()
  }),
]

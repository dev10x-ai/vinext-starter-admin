import { handleApiRequest } from '../../../worker/api'

type RouteContext = {
  params: Promise<{ path?: string[] }>
}

async function handle(request: Request, _context: RouteContext): Promise<Response> {
  const url = new URL(request.url)
  return handleApiRequest(request, url)
}

export const GET = handle
export const POST = handle
export const PUT = handle
export const PATCH = handle
export const DELETE = handle
export const OPTIONS = handle

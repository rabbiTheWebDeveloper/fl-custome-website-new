import { revalidateTag } from "next/cache"
import { NextResponse } from "next/server"

export async function GET() {
  revalidateTag("domain", "max")

  return NextResponse.json({
    revalidated: true,
  })
}

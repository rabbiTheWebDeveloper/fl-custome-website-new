import { revalidateTag } from "next/cache"
import { NextRequest, NextResponse } from "next/server"
import { getCleanDomain } from "@/utils/domain"

export async function GET(req: NextRequest) {
  const cleanDomain = await getCleanDomain()
  if (!cleanDomain) {
    return NextResponse.json({ error: "Missing host param" }, { status: 400 })
  }
  revalidateTag(`domain:${cleanDomain}`, "max")

  return NextResponse.json({
    revalidated: true,
    cleanDomain,
  })
}

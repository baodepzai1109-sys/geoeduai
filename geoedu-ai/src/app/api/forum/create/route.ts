import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { title, content, author, image } = body;

    if (!title || !content || !author) {
      return NextResponse.json(
        { error: "Thiếu dữ liệu." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("forum_posts")
      .insert({
        title,
        content,
        author,
        image: image ?? null,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Lỗi máy chủ." },
      { status: 500 }
    );
  }
}
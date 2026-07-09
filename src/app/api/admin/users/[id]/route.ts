import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

interface Context {
  params: Promise<{
    id: string;
  }>;
}

// ================= PATCH =================

export async function PATCH(
  req: Request,
  { params }: Context
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const { error } = await supabaseAdmin
      .from("users")
      .update(body)
      .eq("id", id);

    if (error) {
      return NextResponse.json(
        {
          error: error.message,
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      success: true,
    });

  } catch (err) {
    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}

// ================= DELETE =================

export async function DELETE(
  req: Request,
  { params }: Context
) {
  try {
    const { id } = await params;

    // Xóa khỏi bảng users
    const { error: dbError } =
      await supabaseAdmin
        .from("users")
        .delete()
        .eq("id", id);

    if (dbError) {
      return NextResponse.json(
        {
          error: dbError.message,
        },
        {
          status: 500,
        }
      );
    }

    // Xóa khỏi Supabase Auth
    const { error: authError } =
      await supabaseAdmin.auth.admin.deleteUser(id);

    if (authError) {
      return NextResponse.json(
        {
          error: authError.message,
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      success: true,
    });

  } catch (err) {
    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}
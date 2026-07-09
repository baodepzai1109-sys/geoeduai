import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const {
      email,
      password,
      name,
      role,
    } = await req.json();

    // Kiểm tra dữ liệu
    if (!email || !password || !name) {
      return NextResponse.json(
        {
          error: "Thiếu thông tin.",
        },
        {
          status: 400,
        }
      );
    }

    // Tạo tài khoản trong Supabase Auth
    const { data, error } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

    if (error) {
      return NextResponse.json(
        {
          error: error.message,
        },
        {
          status: 400,
        }
      );
    }

    // Thêm vào bảng users
    const { error: insertError } =
      await supabaseAdmin
        .from("users")
        .insert({
          id: data.user.id,
          name,
          email,
          role,
          banned: false,
        });

    if (insertError) {
      // Nếu insert lỗi thì xóa luôn tài khoản Auth vừa tạo
      await supabaseAdmin.auth.admin.deleteUser(
        data.user.id
      );

      return NextResponse.json(
        {
          error: insertError.message,
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      success: true,
      user: data.user,
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
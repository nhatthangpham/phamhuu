"use client";

import { Gender, Person } from "@/types";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface MemberFormProps {
  initialData?: Person;
  isEditing?: boolean;
  isAdmin?: boolean;
}

export default function MemberForm({
  initialData,
  isEditing = false,
  isAdmin = false,
}: MemberFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [fullName, setFullName] = useState(initialData?.full_name || "");
  const [gender, setGender] = useState<Gender>(initialData?.gender || "male");
  const [birthYear, setBirthYear] = useState<number | "">(
    initialData?.birth_year || "",
  );
  const [birthMonth, setBirthMonth] = useState<number | "">(
    initialData?.birth_month || "",
  );
  const [birthDay, setBirthDay] = useState<number | "">(
    initialData?.birth_day || "",
  );

  const [deathYear, setDeathYear] = useState<number | "">(
    initialData?.death_year || "",
  );
  const [deathMonth, setDeathMonth] = useState<number | "">(
    initialData?.death_month || "",
  );
  const [deathDay, setDeathDay] = useState<number | "">(
    initialData?.death_day || "",
  );

  const [isDeceased, setIsDeceased] = useState<boolean>(
    initialData?.is_deceased || false,
  );
  const [isInLaw, setIsInLaw] = useState<boolean>(
    initialData?.is_in_law || false,
  );

  const [avatarUrl, setAvatarUrl] = useState(initialData?.avatar_url || "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    initialData?.avatar_url || null,
  );

  const [note, setNote] = useState(initialData?.note || "");

  // Private fields
  const [phoneNumber, setPhoneNumber] = useState(
    initialData?.phone_number || "",
  );
  const [occupation, setOccupation] = useState(initialData?.occupation || "");
  const [currentResidence, setCurrentResidence] = useState(
    initialData?.current_residence || "",
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let finalAvatarUrl = avatarUrl;

      // 0. Handle Avatar Upload if a new file is selected
      if (avatarFile) {
        const fileExt = avatarFile.name.split(".").pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, avatarFile);

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("avatars").getPublicUrl(filePath);

        finalAvatarUrl = publicUrl;
      }

      // 1. Upsert public data
      const personData = {
        full_name: fullName,
        gender,
        birth_year: birthYear === "" ? null : Number(birthYear),
        birth_month: birthMonth === "" ? null : Number(birthMonth),
        birth_day: birthDay === "" ? null : Number(birthDay),
        death_year: isDeceased && deathYear !== "" ? Number(deathYear) : null,
        death_month:
          isDeceased && deathMonth !== "" ? Number(deathMonth) : null,
        death_day: isDeceased && deathDay !== "" ? Number(deathDay) : null,
        is_deceased: isDeceased,
        is_in_law: isInLaw,
        avatar_url: finalAvatarUrl || null,
        note: note || null,
      };

      let personId = initialData?.id;

      if (isEditing && personId) {
        const { error: updateError } = await supabase
          .from("persons")
          .update(personData)
          .eq("id", personId);
        if (updateError) throw updateError;
      } else {
        const { data: newPerson, error: createError } = await supabase
          .from("persons")
          .insert(personData)
          .select()
          .single();
        if (createError) throw createError;
        personId = newPerson.id;
      }

      // 2. Upsert private data (only if admin and personId exists)
      if (isAdmin && personId) {
        const privateData = {
          person_id: personId,
          phone_number: phoneNumber || null,
          occupation: occupation || null,
          current_residence: currentResidence || null,
        };

        const { error: privateError } = await supabase
          .from("person_details_private")
          .upsert(privateData); // Upsert works for both new and existing if we use person_id as unique key

        if (privateError) throw privateError;
      }

      // Redirect to the detail page of the created/edited person so user can easily add relationships
      router.push("/dashboard/members/" + personId);
      router.refresh();
    } catch (err) {
      console.error("Error saving member:", err);
      setError((err as Error).message || "Failed to save member");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 bg-white p-6 rounded-xl shadow-sm border border-stone-100"
    >
      {/* Public Information Section */}
      <div>
        <h3 className="text-lg font-serif font-bold text-stone-800 mb-4 border-b pb-2">
          Thông tin chung
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-stone-700">
              Họ và Tên *
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="bg-white text-stone-900 placeholder-stone-400 mt-1 block w-full rounded-md border-stone-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm px-3 py-2 border"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700">
              Giới tính *
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value as Gender)}
              className="bg-white text-stone-900 placeholder-stone-400 mt-1 block w-full rounded-md border-stone-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm px-3 py-2 border"
            >
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="other">Khác</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Ảnh đại diện
            </label>
            <div className="flex items-center gap-4">
              <div
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-sm text-white overflow-hidden shrink-0 shadow-sm border border-stone-200 bg-stone-100
                  ${!avatarPreview ? (gender === "male" ? "bg-sky-700" : gender === "female" ? "bg-rose-700" : "bg-stone-500") : ""}`}
              >
                {avatarPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="opacity-80">
                    {fullName ? fullName.charAt(0).toUpperCase() : "?"}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setAvatarFile(file);
                        setAvatarPreview(URL.createObjectURL(file));
                      }
                    }}
                    className="block w-full text-sm text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 transition-colors"
                  />
                  {avatarPreview && (
                    <button
                      type="button"
                      onClick={async () => {
                        // If there is an existing URL from Supabase, try to extract the file path to delete it
                        if (
                          initialData?.avatar_url &&
                          avatarUrl === initialData.avatar_url
                        ) {
                          try {
                            // Extract just the filename from the end of the URL
                            const fileName = initialData.avatar_url
                              .split("/")
                              .pop();
                            if (fileName) {
                              const { error: removeError } =
                                await supabase.storage
                                  .from("avatars")
                                  .remove([fileName]);
                              if (removeError) {
                                console.error(
                                  "Error removing avatar from storage:",
                                  removeError,
                                );
                              }
                            }
                          } catch (err) {
                            console.error(
                              "Failed to parse avatar URL for deletion",
                              err,
                            );
                          }
                        }

                        setAvatarUrl("");
                        setAvatarFile(null);
                        setAvatarPreview(null);
                      }}
                      className="text-sm text-rose-600 hover:text-rose-700 font-medium px-3 py-1.5 border border-rose-200 rounded-md bg-rose-50 hover:bg-rose-100 transition-colors whitespace-nowrap"
                    >
                      Xóa ảnh
                    </button>
                  )}
                </div>
                <p className="mt-1 text-xs text-stone-500">
                  Hỗ trợ PNG, JPG, GIF lên đến 2MB.
                </p>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Ngày sinh
            </label>
            <div className="grid grid-cols-3 gap-2">
              <input
                type="number"
                placeholder="Ngày"
                min="1"
                max="31"
                value={birthDay}
                onChange={(e) =>
                  setBirthDay(e.target.value ? Number(e.target.value) : "")
                }
                className="bg-white text-stone-900 placeholder-stone-400 block w-full rounded-md border-stone-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm px-3 py-2 border"
              />
              <input
                type="number"
                placeholder="Tháng"
                min="1"
                max="12"
                value={birthMonth}
                onChange={(e) =>
                  setBirthMonth(e.target.value ? Number(e.target.value) : "")
                }
                className="bg-white text-stone-900 placeholder-stone-400 block w-full rounded-md border-stone-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm px-3 py-2 border"
              />
              <input
                type="number"
                placeholder="Năm"
                value={birthYear}
                onChange={(e) =>
                  setBirthYear(e.target.value ? Number(e.target.value) : "")
                }
                className="bg-white text-stone-900 placeholder-stone-400 block w-full rounded-md border-stone-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm px-3 py-2 border"
              />
            </div>
          </div>

          <div className="md:col-span-2 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 border p-3 rounded-lg bg-stone-50/50">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isInLaw}
                  onChange={(e) => setIsInLaw(e.target.checked)}
                  className="rounded border-stone-300 text-amber-600 focus:ring-amber-500 w-4 h-4 cursor-pointer"
                />
                <span className="text-sm font-medium text-stone-700">
                  Là con Dâu / con Rể
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isDeceased}
                  onChange={(e) => {
                    setIsDeceased(e.target.checked);
                    if (!e.target.checked) {
                      setDeathYear("");
                      setDeathMonth("");
                      setDeathDay("");
                    }
                  }}
                  className="rounded border-stone-300 text-amber-600 focus:ring-amber-500 w-4 h-4 cursor-pointer"
                />
                <span className="text-sm font-medium text-stone-700">
                  Đã qua đời
                </span>
              </label>
            </div>

            {isDeceased && (
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Ngày mất
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="number"
                    placeholder="Ngày"
                    min="1"
                    max="31"
                    value={deathDay}
                    onChange={(e) =>
                      setDeathDay(e.target.value ? Number(e.target.value) : "")
                    }
                    className="bg-white text-stone-900 placeholder-stone-400 block w-full rounded-md border-stone-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm px-3 py-2 border"
                  />
                  <input
                    type="number"
                    placeholder="Tháng"
                    min="1"
                    max="12"
                    value={deathMonth}
                    onChange={(e) =>
                      setDeathMonth(
                        e.target.value ? Number(e.target.value) : "",
                      )
                    }
                    className="bg-white text-stone-900 placeholder-stone-400 block w-full rounded-md border-stone-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm px-3 py-2 border"
                  />
                  <input
                    type="number"
                    placeholder="Năm"
                    value={deathYear}
                    onChange={(e) =>
                      setDeathYear(e.target.value ? Number(e.target.value) : "")
                    }
                    className="bg-white text-stone-900 placeholder-stone-400 block w-full rounded-md border-stone-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm px-3 py-2 border"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-stone-700">
              Ghi chú
            </label>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="bg-white text-stone-900 placeholder-stone-400 mt-1 block w-full rounded-md border-stone-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm px-3 py-2 border"
            />
          </div>
        </div>
      </div>

      {/* Private Information Section (Admin Only) */}
      {isAdmin && (
        <div className="bg-amber-50/50 p-4 rounded-lg border border-amber-100">
          <h3 className="text-lg font-serif font-bold text-amber-900 mb-4 border-b border-amber-200 pb-2 flex items-center gap-2">
            <span>🔒 Thông tin riêng tư</span>
            <span className="text-xs font-normal bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full">
              Admin Only
            </span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-stone-700">
                Số điện thoại
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                disabled={isDeceased}
                className="bg-white text-stone-900 placeholder-stone-400 mt-1 block w-full rounded-md border-stone-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm px-3 py-2 border disabled:bg-stone-100 disabled:text-stone-400"
              />
              {isDeceased && (
                <p className="text-xs text-red-500 mt-1">
                  Không thể nhập SĐT cho người đã mất
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700">
                Nghề nghiệp
              </label>
              <input
                type="text"
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                className="bg-white text-stone-900 placeholder-stone-400 mt-1 block w-full rounded-md border-stone-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm px-3 py-2 border"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-stone-700">
                Nơi ở hiện tại
              </label>
              <input
                type="text"
                value={currentResidence}
                onChange={(e) => setCurrentResidence(e.target.value)}
                className="bg-white text-stone-900 placeholder-stone-400 mt-1 block w-full rounded-md border-stone-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm px-3 py-2 border"
              />
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex justify-end gap-4 pt-4 border-t border-stone-200">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 border border-stone-300 shadow-sm text-sm font-medium rounded-md text-stone-700 bg-white hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-500"
        >
          Hủy
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-amber-700 hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-70"
        >
          {loading ? "Đang lưu..." : isEditing ? "Cập nhật" : "Thêm thành viên"}
        </button>
      </div>
    </form>
  );
}

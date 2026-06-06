"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { updateProfileAction } from "@/db/profile.db";
import { useRouter } from "@/i18n/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/Button/Button";
import { Input } from "@/components/ui/Input/Input";
import { ConfirmChoiceModal } from "@/components/ui/Modal/ConfirmChoiceModal";

import { PhoneSection } from "../PhoneSection/PhoneSection";

import { useAuthStore } from "@/store/useAuthStore";

import { getSupabaseBrowser } from "@/common/utils/supabase/client";
import {
  ProfileFormData,
  createProfileSchema,
} from "@/common/validation/profile/schemas/profile.schema";

import styles from "./ProfileHeader.module.css";

interface ProfileHeaderProps {
  onLoggedOut: () => void;
}

export const ProfileHeader = ({ onLoggedOut }: ProfileHeaderProps) => {
  const t = useTranslations("Profile");
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isConfirmLogoutOpen, setIsConfirmLogoutOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const schema = useMemo(
    () =>
      createProfileSchema({
        nameMin: t("validation.nameMin"),
        nameMax: t("validation.nameMax"),
        nameRegex: t("validation.nameRegex"),
        phoneMax: t("validation.phoneMax"),
        phoneRegex: t("validation.phoneRegex"),
      }),
    [t],
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", phone: "" },
  });

  const startEditing = () => {
    reset({ name: user?.name || "", phone: user?.phone || "" });
    setIsEditing(true);
  };

  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return;

    try {
      const trimmedName = data.name.trim();
      const phone = data.phone?.trim() || "";

      const hasNameChanged = trimmedName !== (user.name || "").trim();
      const hasPhoneChanged = phone !== (user.phone || "");

      if (hasNameChanged || hasPhoneChanged) {
        const updatedData = await updateProfileAction(user.id, {
          name: trimmedName,
          phone,
        });

        updateUser({
          name: updatedData.name || trimmedName,
          phone: updatedData.phone || undefined,
        });
        toast.success(t("save") + "!");
      }

      setIsEditing(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update profile";
      toast.error(message);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const supabase = getSupabaseBrowser();
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      onLoggedOut();
      router.push("/");
    } catch (error) {
      setIsLoggingOut(false);
      const message = error instanceof Error ? error.message : "Failed to log out";
      toast.error(message);
    }
  };

  if (!user) return null;
  if (isLoggingOut) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
      </div>
    );
  }

  return (
    <>
      <div className={styles.profileHeader}>
        <AnimatePresence mode="wait">
          {isEditing ? (
            <motion.form
              key="edit"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleSubmit(onSubmit)}
              className={styles.editForm}
            >
              <h2 className={styles.editFormTitle}>{t("editProfile") || "Edit Profile"}</h2>

              <div className={styles.formGroup}>
                <Input
                  label={t("nameLabel")}
                  {...register("name")}
                  error={errors.name?.message}
                  disabled={isSubmitting}
                  autoFocus
                />
              </div>

              <div className={styles.formGroup}>
                <Input
                  label={t("phoneLabel")}
                  type="tel"
                  {...register("phone")}
                  error={errors.phone?.message}
                  placeholder={t("phonePlaceholder") || "+380..."}
                  disabled={isSubmitting}
                />
              </div>

              <div className={styles.formActions}>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    reset({ name: user.name, phone: user.phone || "" });
                    setIsEditing(false);
                  }}
                  disabled={isSubmitting}
                >
                  {t("cancel")}
                </Button>
                <Button type="submit" disabled={isSubmitting || !isDirty}>
                  {isSubmitting ? <Loader2 className={styles.spinnerIcon} size={16} /> : t("save")}
                </Button>
              </div>
            </motion.form>
          ) : (
            <motion.div
              key="view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className={styles.viewProfile}
            >
              <div className={styles.avatarWrapper}>
                {user.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    width={90}
                    height={90}
                    className={styles.avatar}
                  />
                ) : (
                  <div className={styles.avatarPlaceholder}>{user.name.charAt(0)}</div>
                )}
              </div>
              <div className={styles.profileMeta}>
                <div className={styles.nameContainer}>
                  <h1 className={styles.title}>{user.name}</h1>
                </div>
                <p className={styles.email}>
                  <span className={styles.label}>{t("emailLabel")}</span> {user.email}
                </p>
                <PhoneSection />
              </div>
              <div className={styles.headerActions}>
                <Button variant="secondary" onClick={startEditing}>
                  {t("editProfile") || "Edit Profile"}
                </Button>
                <Button variant="danger" onClick={() => setIsConfirmLogoutOpen(true)}>
                  {t("logoutButton")}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ConfirmChoiceModal
        isOpen={isConfirmLogoutOpen}
        onClose={() => setIsConfirmLogoutOpen(false)}
        onConfirm={handleLogout}
        title={t("logoutConfirmTitle")}
        description={t("logoutConfirmDesc")}
        confirmText={t("logoutConfirmYes")}
        cancelText={t("logoutConfirmNo")}
        isDanger
      />
    </>
  );
};

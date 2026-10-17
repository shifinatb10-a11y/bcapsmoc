import { AdminForm } from "./AdminForm";
import { Field, FormGrid, inputClass } from "./Field";
import { saveFaculty } from "@/app/actions/faculty";
import { saveAssociation, saveReport } from "@/app/actions/association";
import { saveClub, saveClubEvent } from "@/app/actions/club";
import { saveMaterial } from "@/app/actions/study";
import { saveSettings } from "@/app/actions/settings";
import { saveStudent } from "@/app/actions/students";
import { GENDERS } from "@/lib/types";
import type {
  Association,
  Club,
  ClubEvent,
  Faculty,
  Student,
  StudyMaterial,
} from "@/lib/types";

const fileClass =
  "block w-full cursor-pointer rounded-lg border border-ink-100 bg-ink-50 text-sm text-ink-700 file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-brand-600 file:px-3 file:py-2.5 file:text-sm file:font-semibold file:text-white hover:file:bg-brand-700";

function DateField({
  name,
  label,
  value,
}: {
  name: string;
  label: string;
  value?: string | null;
}) {
  return (
    <Field label={label} htmlFor={name}>
      <input
        id={name}
        name={name}
        type="date"
        defaultValue={value ? value.slice(0, 10) : ""}
        className={inputClass}
      />
    </Field>
  );
}

export function FacultyForm({ faculty }: { faculty?: Faculty }) {
  return (
    <AdminForm
      action={saveFaculty}
      submitLabel={faculty ? "Save changes" : "Add faculty member"}
      hiddenFields={faculty ? { id: faculty.id } : undefined}
    >
      <FormGrid cols={2}>
        <Field label="Full name" htmlFor="name" required>
          <input
            id="name"
            name="name"
            required
            defaultValue={faculty?.name ?? ""}
            placeholder="e.g. Anupama T"
            className={inputClass}
          />
        </Field>
        <Field label="Designation" htmlFor="designation" hint="Shown under the name.">
          <input
            id="designation"
            name="designation"
            defaultValue={faculty?.designation ?? faculty?.role_title ?? ""}
            placeholder="e.g. Head of Department"
            className={inputClass}
          />
        </Field>
        <Field label="Qualification" htmlFor="qualification">
          <input
            id="qualification"
            name="qualification"
            defaultValue={faculty?.qualification ?? ""}
            placeholder="e.g. MCA, NET"
            className={inputClass}
          />
        </Field>
        <Field label="Email" htmlFor="email">
          <input
            id="email"
            name="email"
            type="email"
            defaultValue={faculty?.email ?? ""}
            placeholder="name@psmoc.edu"
            className={inputClass}
          />
        </Field>
      </FormGrid>
      <Field label="Short description" htmlFor="bio">
        <textarea
          id="bio"
          name="bio"
          rows={3}
          defaultValue={faculty?.bio ?? ""}
          placeholder="A short note about this faculty member."
          className={inputClass}
        />
      </Field>
      <FormGrid cols={2}>
        <Field label="Display order" htmlFor="display_order" hint="Lower numbers show first.">
          <input
            id="display_order"
            name="display_order"
            type="number"
            defaultValue={faculty?.display_order ?? ""}
            className={inputClass}
          />
        </Field>
        <Field
          label={faculty ? "Replace photo (optional)" : "Photo"}
          htmlFor="photo"
          hint={faculty ? "Leave empty to keep the current photo." : "JPG or PNG."}
        >
          <input
            id="photo"
            name="photo"
            type="file"
            accept="image/*"
            className={fileClass}
          />
        </Field>
      </FormGrid>
    </AdminForm>
  );
}

export function AssociationForm({
  association,
}: {
  association?: Association;
}) {
  return (
    <AdminForm
      action={saveAssociation}
      submitLabel={association ? "Save changes" : "Add association"}
      hiddenFields={association ? { id: association.id } : undefined}
    >
      <FormGrid cols={3}>
        <Field label="Year label" htmlFor="year_label" required hint="e.g. 2026–2027">
          <input
            id="year_label"
            name="year_label"
            required
            defaultValue={association?.year_label ?? ""}
            placeholder="2026–2027"
            className={inputClass}
          />
        </Field>
        <Field label="Start year" htmlFor="start_year">
          <input
            id="start_year"
            name="start_year"
            type="number"
            defaultValue={association?.start_year ?? ""}
            placeholder="2026"
            className={inputClass}
          />
        </Field>
        <Field label="End year" htmlFor="end_year">
          <input
            id="end_year"
            name="end_year"
            type="number"
            defaultValue={association?.end_year ?? ""}
            placeholder="2027"
            className={inputClass}
          />
        </Field>
      </FormGrid>
      <Field label="Association name" htmlFor="name">
        <input
          id="name"
          name="name"
          defaultValue={association?.name ?? "BCA Students' Association"}
          className={inputClass}
        />
      </Field>
      <FormGrid cols={2}>
        <Field label="Secretary name" htmlFor="secretary_name">
          <input
            id="secretary_name"
            name="secretary_name"
            defaultValue={association?.secretary_name ?? ""}
            placeholder="Full name"
            className={inputClass}
          />
        </Field>
        <Field label="Secretary designation" htmlFor="secretary_designation">
          <input
            id="secretary_designation"
            name="secretary_designation"
            defaultValue={association?.secretary_designation ?? "Association Secretary"}
            className={inputClass}
          />
        </Field>
      </FormGrid>
      <Field label="Secretary details" htmlFor="secretary_details">
        <textarea
          id="secretary_details"
          name="secretary_details"
          rows={2}
          defaultValue={association?.secretary_details ?? ""}
          placeholder="Class, achievements, a short bio…"
          className={inputClass}
        />
      </Field>
      <Field label="Association description" htmlFor="description">
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={association?.description ?? ""}
          placeholder="What this association did during its term."
          className={inputClass}
        />
      </Field>
      <FormGrid cols={2}>
        <Field label="Magazine title" htmlFor="magazine_title">
          <input
            id="magazine_title"
            name="magazine_title"
            defaultValue={association?.magazine_title ?? ""}
            placeholder="e.g. Convergence 2026"
            className={inputClass}
          />
        </Field>
        <Field label="Display order" htmlFor="display_order">
          <input
            id="display_order"
            name="display_order"
            type="number"
            defaultValue={association?.display_order ?? ""}
            className={inputClass}
          />
        </Field>
      </FormGrid>
      <FormGrid cols={2}>
        <Field
          label={association ? "Replace secretary photo" : "Secretary photo"}
          htmlFor="secretary_photo"
        >
          <input
            id="secretary_photo"
            name="secretary_photo"
            type="file"
            accept="image/*"
            className={fileClass}
          />
        </Field>
        <Field
          label={association ? "Replace magazine (PDF)" : "Magazine (PDF)"}
          htmlFor="magazine"
        >
          <input
            id="magazine"
            name="magazine"
            type="file"
            accept="application/pdf"
            className={fileClass}
          />
        </Field>
      </FormGrid>
    </AdminForm>
  );
}

export function ReportForm({
  associations,
  report,
  defaultAssociationId,
}: {
  associations: Association[];
  report?: import("@/lib/types").AssociationReport;
  defaultAssociationId?: string;
}) {
  return (
    <AdminForm
      action={saveReport}
      submitLabel={report ? "Save changes" : "Add report"}
      hiddenFields={report ? { id: report.id } : undefined}
    >
      <FormGrid cols={2}>
        <Field label="Association" htmlFor="association_id" required>
          <select
            id="association_id"
            name="association_id"
            required
            defaultValue={report?.association_id ?? defaultAssociationId ?? ""}
            className={inputClass}
          >
            <option value="">Select association…</option>
            {associations.map((item) => (
              <option key={item.id} value={item.id}>
                {item.year_label}
              </option>
            ))}
          </select>
        </Field>
        <DateField name="event_date" label="Event date" value={report?.event_date} />
      </FormGrid>
      <Field label="Report title" htmlFor="title" required>
        <input
          id="title"
          name="title"
          required
          defaultValue={report?.title ?? ""}
          placeholder="e.g. National Tech Fest — Report"
          className={inputClass}
        />
      </Field>
      <Field label="Description" htmlFor="description">
        <textarea
          id="description"
          name="description"
          rows={2}
          defaultValue={report?.description ?? ""}
          className={inputClass}
        />
      </Field>
      <Field
        label={report ? "Replace report (PDF)" : "Report file (PDF)"}
        htmlFor="document"
        hint={report ? "Leave empty to keep the current file." : undefined}
      >
        <input
          id="document"
          name="document"
          type="file"
          accept="application/pdf"
          className={fileClass}
        />
      </Field>
    </AdminForm>
  );
}

export function ClubForm({ club }: { club?: Club }) {
  return (
    <AdminForm
      action={saveClub}
      submitLabel={club ? "Save changes" : "Create club"}
      hiddenFields={club ? { id: club.id } : undefined}
    >
      <Field label="Club name" htmlFor="name" required>
        <input
          id="name"
          name="name"
          required
          defaultValue={club?.name ?? ""}
          placeholder="e.g. CodeCrafters Club"
          className={inputClass}
        />
      </Field>
      <Field label="Tagline" htmlFor="tagline">
        <input
          id="tagline"
          name="tagline"
          defaultValue={club?.tagline ?? ""}
          placeholder="One-line description shown on the homepage."
          className={inputClass}
        />
      </Field>
      <Field label="Description" htmlFor="description">
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={club?.description ?? ""}
          className={inputClass}
        />
      </Field>
      <FormGrid cols={2}>
        <Field label="Display order" htmlFor="display_order">
          <input
            id="display_order"
            name="display_order"
            type="number"
            defaultValue={club?.display_order ?? ""}
            className={inputClass}
          />
        </Field>
        <Field
          label={club ? "Replace cover image" : "Cover image"}
          htmlFor="cover_image"
        >
          <input
            id="cover_image"
            name="cover_image"
            type="file"
            accept="image/*"
            className={fileClass}
          />
        </Field>
      </FormGrid>
    </AdminForm>
  );
}

export function ClubEventForm({
  club,
  event,
}: {
  club: Club;
  event?: ClubEvent;
}) {
  return (
    <AdminForm
      action={saveClubEvent}
      submitLabel={event ? "Save changes" : "Add club event"}
      hiddenFields={{ club_id: club.id, ...(event ? { id: event.id } : {}) }}
    >
      <FormGrid cols={2}>
        <Field label="Event title" htmlFor="title" required>
          <input
            id="title"
            name="title"
            required
            defaultValue={event?.title ?? ""}
            className={inputClass}
          />
        </Field>
        <DateField name="event_date" label="Event date" value={event?.event_date} />
      </FormGrid>
      <Field label="Description" htmlFor="description">
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={event?.description ?? ""}
          className={inputClass}
        />
      </Field>
      <FormGrid cols={2}>
        <Field label={event ? "Replace image" : "Event image"} htmlFor="image">
          <input
            id="image"
            name="image"
            type="file"
            accept="image/*"
            className={fileClass}
          />
        </Field>
        <Field label={event ? "Replace report (PDF)" : "Report (PDF)"} htmlFor="report">
          <input
            id="report"
            name="report"
            type="file"
            accept="application/pdf"
            className={fileClass}
          />
        </Field>
      </FormGrid>
    </AdminForm>
  );
}

export function MaterialForm({ material }: { material?: StudyMaterial }) {
  return (
    <AdminForm
      action={saveMaterial}
      submitLabel={material ? "Save changes" : "Add study material"}
      hiddenFields={material ? { id: material.id } : undefined}
    >
      <FormGrid cols={2}>
        <Field label="Category" htmlFor="category" required>
          <select
            id="category"
            name="category"
            defaultValue={material?.category ?? "question_paper"}
            className={inputClass}
          >
            <option value="question_paper">Question paper</option>
            <option value="notes">Notes</option>
          </select>
        </Field>
        <Field label="Title" htmlFor="title" required>
          <input
            id="title"
            name="title"
            required
            defaultValue={material?.title ?? ""}
            placeholder="e.g. Data Structures — Previous Year Paper"
            className={inputClass}
          />
        </Field>
        <Field label="Subject" htmlFor="subject">
          <input
            id="subject"
            name="subject"
            defaultValue={material?.subject ?? ""}
            placeholder="e.g. Data Structures"
            className={inputClass}
          />
        </Field>
        <Field label="Semester" htmlFor="semester">
          <input
            id="semester"
            name="semester"
            defaultValue={material?.semester ?? ""}
            placeholder="e.g. Semester 3"
            className={inputClass}
          />
        </Field>
        <Field label="Year" htmlFor="year">
          <input
            id="year"
            name="year"
            defaultValue={material?.year ?? ""}
            placeholder="e.g. 2024"
            className={inputClass}
          />
        </Field>
      </FormGrid>
      <Field label="Description" htmlFor="description">
        <textarea
          id="description"
          name="description"
          rows={2}
          defaultValue={material?.description ?? ""}
          className={inputClass}
        />
      </Field>
      <Field
        label={material ? "Replace file (PDF)" : "File (PDF)"}
        htmlFor="document"
        hint={material ? "Leave empty to keep the current file." : undefined}
      >
        <input
          id="document"
          name="document"
          type="file"
          accept="application/pdf"
          className={fileClass}
        />
      </Field>
    </AdminForm>
  );
}

export function SettingsForm({
  settings,
}: {
  settings: Record<string, string>;
}) {
  return (
    <AdminForm action={saveSettings} submitLabel="Save settings">
      <Field
        label="Homepage hero image"
        htmlFor="hero_image"
        hint="Shown at the top of the dashboard. A wide landscape photo works best. Leave empty to keep the current image."
      >
        <input
          id="hero_image"
          name="hero_image"
          type="file"
          accept="image/*"
          className={fileClass}
        />
      </Field>
      <Field label="Hero tagline" htmlFor="hero_tagline">
        <textarea
          id="hero_tagline"
          name="hero_tagline"
          rows={2}
          defaultValue={settings.hero_tagline ?? ""}
          placeholder="Short introduction shown on the homepage."
          className={inputClass}
        />
      </Field>
      <Field label="Department overview" htmlFor="department_intro">
        <textarea
          id="department_intro"
          name="department_intro"
          rows={4}
          defaultValue={settings.department_intro ?? ""}
          className={inputClass}
        />
      </Field>
      <Field label="Department overview (continued)" htmlFor="department_intro_secondary">
        <textarea
          id="department_intro_secondary"
          name="department_intro_secondary"
          rows={4}
          defaultValue={settings.department_intro_secondary ?? ""}
          className={inputClass}
        />
      </Field>
    </AdminForm>
  );
}

export function StudentForm({
  student,
  batch,
  semester,
}: {
  student?: Student;
  batch: string;
  semester: number;
}) {
  return (
    <AdminForm
      action={saveStudent}
      submitLabel={student ? "Save changes" : "Add student"}
      hiddenFields={{
        batch,
        semester,
        ...(student ? { id: student.id } : {}),
      }}
    >
      <FormGrid cols={2}>
        <Field label="Student name" htmlFor="name" required>
          <input
            id="name"
            name="name"
            required
            defaultValue={student?.name ?? ""}
            placeholder="Full name"
            className={inputClass}
          />
        </Field>
        <Field label="Gender" htmlFor="gender">
          <select
            id="gender"
            name="gender"
            defaultValue={student?.gender ?? ""}
            className={inputClass}
          >
            <option value="">Not specified</option>
            {GENDERS.map((gender) => (
              <option key={gender} value={gender}>
                {gender}
              </option>
            ))}
          </select>
        </Field>
      </FormGrid>

      <FormGrid cols={2}>
        <Field label="Roll number" htmlFor="roll_no">
          <input
            id="roll_no"
            name="roll_no"
            defaultValue={student?.roll_no ?? ""}
            placeholder="e.g. 25BCA01"
            className={inputClass}
          />
        </Field>
        <Field label="Admission number" htmlFor="admission_no">
          <input
            id="admission_no"
            name="admission_no"
            defaultValue={student?.admission_no ?? ""}
            placeholder="e.g. ADM/2025/001"
            className={inputClass}
          />
        </Field>
        <Field label="Register number" htmlFor="register_no">
          <input
            id="register_no"
            name="register_no"
            defaultValue={student?.register_no ?? ""}
            placeholder="e.g. 2025/BCA/1234"
            className={inputClass}
          />
        </Field>
        <Field label="APAAR ID" htmlFor="apaar_id">
          <input
            id="apaar_id"
            name="apaar_id"
            defaultValue={student?.apaar_id ?? ""}
            placeholder="APAAR / ABC ID"
            className={inputClass}
          />
        </Field>
      </FormGrid>

      <FormGrid cols={2}>
        <DateField name="dob" label="Date of birth" value={student?.dob} />
        <Field label="Mobile number" htmlFor="mobile">
          <input
            id="mobile"
            name="mobile"
            type="tel"
            defaultValue={student?.mobile ?? ""}
            placeholder="10-digit mobile number"
            className={inputClass}
          />
        </Field>
      </FormGrid>

      <Field label="Email ID" htmlFor="email">
        <input
          id="email"
          name="email"
          type="email"
          defaultValue={student?.email ?? ""}
          placeholder="student@example.com"
          className={inputClass}
        />
      </Field>
    </AdminForm>
  );
}

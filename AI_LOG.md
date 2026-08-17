AI_LOG.md

AI Tools Used

AI tools were used throughout the build, primarily:

Claude --- implementation assistance, debugging, architecture
review, seed-data corrections, validation, and documentation review.

Codex --- final targeted frontend debugging and cleanup.

ChatGPT --- requirement breakdown, test planning, code-review
guidance, and verification checklists.

The assignment explicitly permits and expects AI-assisted development.
The important goal was to verify the generated work rather than accept
it blindly.

What AI Was Used For

AI assistance was used to:

Break the Wantace brief into mandatory versus optional requirements.

Review the configuration-driven architecture.

Help implement and review API, authentication, configuration, and
lead flows.

Correct the seed data so the supplied historical leads were
preserved.

Add protection for pricing-critical questions.

Review server-side validation and calculation behavior.

Check that frontend business configuration was not hardcoded.

Diagnose a frontend issue where empty validation list items appeared
as red dots on the final estimator step.

Prepare deployment and submission checklists.

Draft and refine the project documentation.

Example of AI Output That Required Correction

AI-assisted implementation initially required verification around the
supplied historical data and configuration behavior.

The historical leads in the brief are not all compatible with the
current configuration. In particular, one legacy lead uses
config_version: 1 and answer keys that are not present in the current
configuration.

Instead of normalizing that historical record into the current schema,
the implementation was corrected to preserve the supplied historical
data and its original estimate values.

This was important because the task explicitly says to treat the
supplied seed data as production data.

A second verification pass also identified the need to protect
pricing-critical questions from being disabled in a way that would break
the estimator.

Human Verification / Ownership

I did not treat AI-generated code as automatically correct.

I verified the application by running the seed process, starting the
frontend/backend, testing the public estimator, submitting real test
leads, checking those leads in the owner dashboard, changing
configuration values, and confirming that configuration changes became
live without a frontend redeployment.

I also verified the owner authentication flow and the
configuration-version behavior.

The final frontend validation-message issue was handled as a targeted
fix rather than using it as an opportunity to refactor unrelated parts
of the application.

What I Substantially Reviewed or Reworked

I substantially reviewed:

configuration-driven rendering

server-side calculation flow

validation boundaries

configuration versioning

historical seed data handling

owner authentication

lead persistence

frontend error handling

deployment configuration

The final implementation was evaluated against the original Wantace
requirements rather than only against whether the code compiled.

Verification Mindset

The main use of AI was acceleration, not substitution for engineering
judgment.

For each important AI-assisted change, the target behavior was checked
through the running application, API behavior, database persistence, or
build/test output where applicable.
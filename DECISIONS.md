DECISIONS.md

1. Scope and Architecture

I treated the core requirement as a configuration-driven estimator
rather than a generic roofing website.

The application uses a MERN-style architecture:

React/Vite for the public estimator and owner panel

Node/Express for the API

MongoDB/Mongoose for configuration and leads

JWT-based authentication for the owner panel

The most important architectural decision was to keep business
configuration on the server/database. Questions, labels, options, and
rates are returned by the API at runtime instead of being defined in
frontend source code. This directly addresses the central constraint in
the brief.

2. Assumptions Where the Brief Was Silent

Owner authentication

The brief says basic authentication is sufficient, so I used a simple
authenticated owner flow rather than building roles, permissions, or a
full identity-management system.

Configuration versions

A configuration change creates a new version. Leads store the
configuration version used for their estimate. This gives each estimate
a clear pricing context and prevents a configuration edit from producing
a mixed calculation.

Pricing-critical questions

The supplied estimator requires roof area, material, pitch, layers, and
stories for the calculation. I treated those as pricing-critical and
prevent an owner from disabling them in a way that would make the
estimator impossible to calculate.

Historical leads

The supplied leads are treated as historical production data. Their
original configuration versions and estimate ranges are preserved even
when their answer keys do not match the current configuration.

Numeric input

Form values can arrive as strings, so numeric values are normalized
before calculation and validation rather than relying on JavaScript
coercion.

3. Calculation Formula

The calculation is intentionally server-side.

Material cost

roof_area × material_rate × (1 + waste_factor)

Tear-off cost

roof_area × tear_off_rate

Adjusted subtotal

(material_cost + tear_off_cost)
× pitch_multiplier
× stories_multiplier

Mid estimate

adjusted_subtotal + permit_flat_fee

Range

low  = mid_estimate × (1 - spread)
high = mid_estimate × (1 + spread)

The final values are rounded.

I did not attempt to force the current formula to reproduce the
historical seed estimates because the brief explicitly says those are
historical client figures and should not be assumed to match the new
formula.

4. Handling Questionable Seed Data

One historical lead uses config_version: 1 and contains legacy answers
such as slate_natural, chimney_count, and gutter_replace, while
the supplied current configuration is version 3 and does not define
those fields.

I preserved that record rather than rewriting it into the current
schema. The owner panel treats historical answers as stored lead data
instead of assuming every historical answer must exist in the current
configuration.

This preserves the client's data instead of silently changing production
history.

5. What I Deliberately Did Not Build

I prioritized the mandatory workflow over stretch features.

I did not make the following part of the core submission:

CSV lead export

outbound lead webhooks

a full question-creation/builder interface

advanced analytics

complex user roles and permissions

notification/email automation

These features could be added later, but implementing them during the
time-limited task would have increased scope without improving the core
estimator → estimate → lead workflow.

6. Questions I Would Ask Dale Before a Production Build

Should estimates include labor, disposal, taxes, or other cost
components beyond the supplied formula?

What exact phone/email validation rules should be used for real
homeowner leads?

Should owners be able to create entirely new question types, or only
edit the supplied questions?

Should configuration changes require an explicit publish action?

How long should lead/contact data be retained?

Who should have access to the owner panel, and do different staff
members need different permissions?

Should a homeowner be able to resume an estimator started before a
configuration change?

Should the estimate range be accompanied by a disclaimer or a
request-for-quote CTA?

What production analytics or lead-delivery integrations are
required?

What accessibility and branding standards should the production site
follow?

7. What I Would Do With Another Week

With another week I would focus on production hardening rather than
adding unrelated features:

Add stronger integration/end-to-end test coverage

Add configuration history/audit visibility

Add CSV export for leads

Add configurable outbound lead webhook delivery

Improve accessibility and keyboard navigation

Add more comprehensive phone/email validation

Improve owner feedback around configuration publishing and
validation

Add monitoring and structured server logging

Add rate limiting and stronger production security controls

Add automated deployment checks

8. Engineering Principle

The main decision throughout the task was to protect the core contract:

Database configuration
        ↓
Backend API
        ↓
Dynamic frontend
        ↓
Server-side calculation
        ↓
Persisted lead
        ↓
Owner visibility

A smaller completed system was preferable to adding features that could
leave this core flow unreliable.
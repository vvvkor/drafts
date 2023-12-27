# Granum 2024

## Todo

- minimal.css
= compatible.css (no :has)
+ toggle.js (+dropdown, +hint, +pop:hover =.pop#target; +tree-nest-details, +target, +accordion, +modal, +drawer, +gallery, +tabs, +.check)
- slider
- .tag .badge .circle
- @screen
- repo: rearrange folders, buld, demo page
- js? (#back, #prev, #next, esc, splitter, dialog, drag, freedrag, pos?, progress)
=? container: overflow?
-? mobile: stretch date inputs?
+ .screenX .ifX (responsive) = .hide-s/m/l, .show-s/m/l (override #target)
+ .resp-X, .hide/show-X, @container
+ .input details.pop
+ validate: border & .input
+ status color vars
+ vars by files; inverted
=? .invert {--link:link-invert}
+ mobile: footer.stick inside container? [inside scrollable]
= icon @print [enable bg grapgics]
+ .icon-spin
+ #x1:checked
+ @print
+ .scrollbar
= .h1
= .check

## Changes

.report -- .tip
.roll -- .scroll
.text-X -- .danger...
.bg-X -- .bg.danger...

## Additions

.bord.danger...
.mars .pads .wide-s/m/l
.show-s/m/l .hide-s/m/l .show-cs/cm/cl .hide-cs/cm/cl
.form.resp.just.dock > .shift.span.just-l/c/r/s
.input .switch .dropzone .validate .detect
label.check, input.check
.row.stretch details.pop .backdrop
.grid-xs/s/m/l.gap > .span-2/3/4

## Typography

.sans .serif .mono .l .r .c .mid .small
img.c.fit
table.wide.mid.fit.line.bord.c.c#.r#
ul.fit
.nobr

## Space

.fit .mar .mars .pad .pads .bord .rad .full .resize .scroll .scrollbar
.wide .wide-s/m/l .center

## Colors

.hilite .hover .shade .diagonals
.neutral .note .info .success .warning .danger
.bg .text .ic .bord .invert
body.invert
.act

## Display

.show.hide
.show-s/m/l, .hide-s/m/l (@media)
.show-cs/cm/cl, .hide-cs/cm/cl (@container)

## Form

.form.resp.just.dock > .shift.span.just-l/c/r/s (.resp@container)

## Inputs

.input
.switch
.dropzone

## Validation

.validate
.tip
.detect
.inact

## Layout

### Grid

.grid-xs/s/m/l.gap > .span-2/3/4

### Row

.row.wrap.resp.resp-s.vert.gap.mid.stretch > .col-0/1/2/3.push.shift.stick (.resp@container@media)
ul.row ul.l

### Stack

.stack.line

### Stick

.stick, footer.stick, .row > .stick

## Toggle

details.pop.l[open] summary.icon-x > :last-child
ul.row:hover - see [row]
.pop.l:hover
[data-hint]:hover
.target#target
.modal.full#target
.modal.full + (.corner a[#first] + a[#close]) + (a[#next] > img.target#target)
.drawer.shift#target
ul.row.tabs + div>#
(label.check > input) + *
label ... input.check + *
#target + .backdrop, body>.backdrop
#x1:checked .x1

## Icons

.icon-x.empty:empty
.icon-menu/close, -next/desc, -folder/open, -add/no, -expand/collapse
.icon-spin

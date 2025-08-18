<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { cn } from '@/utils'
import { buttonVariants } from '@/components/atoms/buttonVariants'

type Mode = 'single' | 'range'
type RangeValue = { from: Date | null; to: Date | null }

const props = withDefaults(
  defineProps<{
    modelValue?: Date | RangeValue | null
    mode?: Mode
    showOutsideDays?: boolean
    class?: string
    classNames?: Partial<Record<string, string>>
  }>(),
  {
    modelValue: null,
    mode: 'single',
    showOutsideDays: true,
    class: '',
    classNames: () => ({}),
  },
)

const emit = defineEmits<{ (e: 'update:modelValue', v: Date | RangeValue | null): void }>()

const today = new Date()
const current = ref(new Date(today.getFullYear(), today.getMonth(), 1))

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1)
}
function endOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0)
}
function addMonths(d: Date, m: number) {
  return new Date(d.getFullYear(), d.getMonth() + m, 1)
}
function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}
function isBetween(d: Date, a?: Date | null, b?: Date | null) {
  if (!a || !b) return false
  const t = +new Date(d.getFullYear(), d.getMonth(), d.getDate())
  const x = +new Date(a.getFullYear(), a.getMonth(), a.getDate())
  const y = +new Date(b.getFullYear(), b.getMonth(), b.getDate())
  return t >= Math.min(x, y) && t <= Math.max(x, y)
}
function getWeeks(month: Date, showOutside: boolean) {
  const start = startOfMonth(month)
  const end = endOfMonth(month)
  const startDay = (start.getDay() + 6) % 7 // Monday-first
  const daysInMonth = end.getDate()
  const days: { date: Date; inMonth: boolean }[] = []
  // prev days
  if (showOutside) {
    for (let i = startDay - 1; i >= 0; i--) {
      const d = new Date(month.getFullYear(), month.getMonth(), -i)
      days.push({ date: d, inMonth: false })
    }
  } else {
    for (let i = 0; i < startDay; i++) days.push({ date: new Date(NaN), inMonth: false })
  }
  // month days
  for (let i = 1; i <= daysInMonth; i++)
    days.push({ date: new Date(month.getFullYear(), month.getMonth(), i), inMonth: true })
  // next filler
  const rem = (7 - (days.length % 7)) % 7
  if (rem) {
    if (showOutside) {
      for (let i = 1; i <= rem; i++) {
        const d = new Date(month.getFullYear(), month.getMonth() + 1, i)
        days.push({ date: d, inMonth: false })
      }
    } else {
      for (let i = 0; i < rem; i++) days.push({ date: new Date(NaN), inMonth: false })
    }
  }
  // chunk
  const weeks: (typeof days)[] = []
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7))
  return weeks
}

const weekLabels = ['L', 'M', 'X', 'J', 'V', 'S', 'D']

const range = ref<RangeValue>({ from: null, to: null })
const single = ref<Date | null>(null)

watch(
  () => props.modelValue,
  (v) => {
    if (props.mode === 'range') {
      const rv = (v as RangeValue) || { from: null, to: null }
      range.value = { from: rv?.from ?? null, to: rv?.to ?? null }
    } else {
      single.value = (v as Date) ?? null
    }
  },
  { immediate: true },
)

function prev() {
  current.value = addMonths(current.value, -1)
}
function next() {
  current.value = addMonths(current.value, 1)
}

function onSelectDay(d: Date) {
  if (Number.isNaN(+d)) return
  if (props.mode === 'single') {
    single.value = d
    emit('update:modelValue', d)
  } else {
    const { from, to } = range.value
    if (!from || (from && to)) {
      range.value = { from: d, to: null }
    } else if (from && !to) {
      if (isSameDay(d, from)) {
        range.value = { from: d, to: d }
      } else {
        range.value = { from, to: d }
      }
      emit('update:modelValue', range.value)
    }
  }
}

const weeks = computed(() => getWeeks(current.value, !!props.showOutsideDays))

function isSelected(d: Date) {
  if (props.mode === 'single') return single.value ? isSameDay(d, single.value) : false
  const { from, to } = range.value
  if (from && to) return isBetween(d, from, to)
  return false
}
function isStart(d: Date) {
  return props.mode === 'range' && range.value.from && isSameDay(d, range.value.from)
}
function isEnd(d: Date) {
  return props.mode === 'range' && range.value.to && isSameDay(d, range.value.to)
}
</script>

<template>
  <div class="p-3" :class="props.class">
    <div :class="cn('flex flex-col sm:flex-row gap-2', props.classNames?.months)">
      <div :class="cn('flex flex-col gap-4', props.classNames?.month)">
        <!-- Caption -->
        <div
          :class="
            cn('flex justify-center pt-1 relative items-center w-full', props.classNames?.caption)
          "
        >
          <div :class="cn('text-sm font-medium', props.classNames?.caption_label)">
            {{ current.toLocaleString(undefined, { month: 'long', year: 'numeric' }) }}
          </div>
          <div :class="cn('flex items-center gap-1', props.classNames?.nav)">
            <button
              type="button"
              :class="
                cn(
                  buttonVariants({ variant: 'outline' }),
                  'size-7 bg-transparent p-0 opacity-50 hover:opacity-100',
                  props.classNames?.nav_button,
                  props.classNames?.nav_button_previous,
                  'absolute left-1',
                )
              "
              @click="prev"
              aria-label="Previous month"
            >
              <ChevronLeft class="size-4" />
            </button>
            <button
              type="button"
              :class="
                cn(
                  buttonVariants({ variant: 'outline' }),
                  'size-7 bg-transparent p-0 opacity-50 hover:opacity-100',
                  props.classNames?.nav_button,
                  props.classNames?.nav_button_next,
                  'absolute right-1',
                )
              "
              @click="next"
              aria-label="Next month"
            >
              <ChevronRight class="size-4" />
            </button>
          </div>
        </div>

        <!-- Table -->
        <div :class="cn('w-full border-collapse space-x-1', props.classNames?.table)">
          <div :class="cn('flex', props.classNames?.head_row)">
            <div
              v-for="l in weekLabels"
              :key="l"
              :class="
                cn(
                  'text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]',
                  props.classNames?.head_cell,
                )
              "
            >
              {{ l }}
            </div>
          </div>

          <div
            v-for="(row, r) in weeks"
            :key="r"
            :class="cn('flex w-full mt-2', props.classNames?.row)"
          >
            <div
              v-for="cell in row"
              :key="cell.date.toISOString() + String(cell.inMonth)"
              :class="
                cn(
                  'relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-range-end)]:rounded-r-md',
                  props.mode === 'range'
                    ? '[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md'
                    : '[&:has([aria-selected])]:rounded-md',
                  props.classNames?.cell,
                )
              "
            >
              <button
                type="button"
                :disabled="Number.isNaN(+cell.date)"
                :aria-selected="isSelected(cell.date) || undefined"
                :class="
                  cn(
                    buttonVariants({ variant: 'ghost' }),
                    'size-8 p-0 font-normal aria-selected:opacity-100',
                    !cell.inMonth &&
                      'day-outside text-muted-foreground aria-selected:text-muted-foreground',
                    isStart(cell.date) &&
                      'day-range-start aria-selected:bg-primary aria-selected:text-primary-foreground',
                    isEnd(cell.date) &&
                      'day-range-end aria-selected:bg-primary aria-selected:text-primary-foreground',
                    isSelected(cell.date) &&
                      !isStart(cell.date) &&
                      !isEnd(cell.date) &&
                      'aria-selected:bg-accent aria-selected:text-accent-foreground',
                    props.classNames?.day,
                  )
                "
                @click="onSelectDay(cell.date)"
              >
                {{ cell.date.getDate() || '' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

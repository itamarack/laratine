type Variant = {
  status?: string;
}

export default function badgeVariant({ status }: Variant) {
  if (status === 'published') {
    return
  }
}

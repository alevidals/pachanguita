type Props = {
  children: React.ReactNode;
};

export default function AuthLayout(props: Props) {
  return (
    <div className="grid min-h-dvh grid-cols-1 sm:grid-cols-2">
      {props.children}
      <div className="hidden bg-foreground sm:flex" />
    </div>
  );
}

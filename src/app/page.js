import { redirect } from 'next/navigation';

export default function HomePage() {
  // เมื่อเข้าถึง URL '/' จะเปลี่ยนเส้นทางไปยัง '/login' ทันที
  redirect('/FindDoctor');
}
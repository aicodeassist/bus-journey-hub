import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Booking, getBookings, cancelBooking, calculateRefund } from "@/lib/bookingStorage";
import { Bus, MapPin, Clock, Calendar, ArrowRight, XCircle, Edit, AlertTriangle, CheckCircle, RefreshCw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const MyBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showModifyDialog, setShowModifyDialog] = useState(false);
  const [cancelResult, setCancelResult] = useState<{ refundAmount: number; message: string } | null>(null);

  useEffect(() => {
    setBookings(getBookings());
  }, []);

  const handleCancelClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setCancelResult(null);
    setShowCancelDialog(true);
  };

  const handleModifyClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowModifyDialog(true);
  };

  const confirmCancel = () => {
    if (!selectedBooking) return;
    
    const result = cancelBooking(selectedBooking.id);
    setCancelResult({ refundAmount: result.refundAmount, message: result.message });
    setBookings(getBookings());
  };

  const handleModifySearch = () => {
    if (!selectedBooking) return;
    
    // Navigate to search with pre-filled data for rebooking
    navigate(`/search?from=${encodeURIComponent(selectedBooking.from)}&to=${encodeURIComponent(selectedBooking.to)}&date=${selectedBooking.date}&adults=${selectedBooking.adults}&children=${selectedBooking.children}&modifyBookingId=${selectedBooking.id}`);
  };

  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-accent/20 text-accent text-xs font-medium">
            <CheckCircle className="w-3 h-3" />
            Активне
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-destructive/20 text-destructive text-xs font-medium">
            <XCircle className="w-3 h-3" />
            Скасовано
          </span>
        );
      case 'modified':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium">
            <RefreshCw className="w-3 h-3" />
            Змінено
          </span>
        );
    }
  };

  const refundInfo = selectedBooking ? calculateRefund(selectedBooking) : null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="font-display font-bold text-3xl text-foreground mb-8">Мої бронювання</h1>

          {bookings.length === 0 ? (
            <div className="text-center py-16">
              <Bus className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">У вас ще немає бронювань</h2>
              <p className="text-muted-foreground mb-6">Знайдіть свій перший рейс і забронюйте квиток</p>
              <Button onClick={() => navigate("/")} className="btn-primary">
                Знайти рейс
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className={`bg-card rounded-2xl shadow-card p-6 ${booking.status === 'cancelled' ? 'opacity-60' : ''}`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-mono text-muted-foreground">#{booking.id}</span>
                        {getStatusBadge(booking.status)}
                      </div>
                      <div className="flex items-center gap-2 text-lg font-semibold">
                        <span>{booking.boardingCity}</span>
                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                        <span>{booking.alightingCity}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">{booking.totalPrice} ₴</div>
                      {booking.status === 'cancelled' && booking.refundAmount !== undefined && (
                        <div className="text-sm text-accent">
                          Повернено: {booking.refundAmount} ₴
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 py-4 border-y border-border">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">
                        {new Date(booking.date).toLocaleDateString("uk-UA", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{booking.boardingTime} - {booking.alightingTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm truncate">{booking.boardingStation || booking.boardingCity}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {booking.passenger.firstName} {booking.passenger.lastName}
                    </div>
                  </div>

                  {booking.status === 'active' && (
                    <div className="flex flex-wrap gap-3">
                      <Button
                        variant="outline"
                        onClick={() => handleModifyClick(booking)}
                        className="flex items-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Змінити
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleCancelClick(booking)}
                        className="flex items-center gap-2 text-destructive hover:text-destructive border-destructive/30 hover:bg-destructive/10"
                      >
                        <XCircle className="w-4 h-4" />
                        Скасувати
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Скасування бронювання
            </DialogTitle>
            <DialogDescription>
              {cancelResult ? (
                <div className="py-4 text-center">
                  <CheckCircle className="w-12 h-12 mx-auto text-accent mb-3" />
                  <p className="text-foreground font-semibold mb-2">Бронювання успішно скасовано</p>
                  <p className="text-muted-foreground">{cancelResult.message}</p>
                  <p className="text-2xl font-bold text-accent mt-4">
                    Повернення: {cancelResult.refundAmount} ₴
                  </p>
                </div>
              ) : (
                <div className="py-4">
                  <p className="mb-4">
                    Ви впевнені, що хочете скасувати бронювання <strong>#{selectedBooking?.id}</strong>?
                  </p>
                  
                  {refundInfo && (
                    <div className="bg-secondary/50 rounded-xl p-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Вартість квитка:</span>
                        <span>{selectedBooking?.totalPrice} ₴</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Відсоток повернення:</span>
                        <span>{refundInfo.refundPercentage}%</span>
                      </div>
                      <div className="flex justify-between font-semibold text-lg border-t border-border pt-2">
                        <span>Сума до повернення:</span>
                        <span className="text-accent">{refundInfo.refundAmount} ₴</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">{refundInfo.message}</p>
                    </div>
                  )}
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            {cancelResult ? (
              <Button onClick={() => setShowCancelDialog(false)}>
                Закрити
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
                  Назад
                </Button>
                <Button variant="destructive" onClick={confirmCancel}>
                  Скасувати бронювання
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modify Booking Dialog */}
      <Dialog open={showModifyDialog} onOpenChange={setShowModifyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5 text-primary" />
              Зміна бронювання
            </DialogTitle>
            <DialogDescription>
              <div className="py-4">
                <p className="mb-4">
                  Для зміни бронювання <strong>#{selectedBooking?.id}</strong> ви можете:
                </p>
                
                <div className="space-y-3">
                  <div className="bg-secondary/50 rounded-xl p-4">
                    <h4 className="font-semibold mb-2">Пошук нового рейсу</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Знайдіть новий рейс та оформіть нове бронювання. Поточне бронювання буде автоматично скасовано з поверненням коштів.
                    </p>
                    <Button onClick={handleModifySearch} className="w-full">
                      Знайти інший рейс
                    </Button>
                  </div>
                  
                  {refundInfo && (
                    <div className="text-xs text-muted-foreground text-center">
                      При скасуванні буде повернено: {refundInfo.refundAmount} ₴ ({refundInfo.refundPercentage}%)
                    </div>
                  )}
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowModifyDialog(false)}>
              Закрити
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default MyBookings;

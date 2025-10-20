namespace InterviewApi.Models;

public class Visitation
{
    public int Id { get; set; }
    public int CustomerId { get; set; }
    public int HotelId { get; set; }
    public DateTime VisitDate { get; set; }
}

public class VisitationData
{
    public List<Visitation> Visitations { get; set; } = new();
}
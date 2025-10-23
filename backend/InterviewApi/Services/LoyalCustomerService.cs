using InterviewApi.Models;

namespace InterviewApi.Services;

public static class LoyalCustomerService
{
    /// <summary>
    /// Finds loyal customers for a given month
    /// A loyal customer visits the same hotel on the same day of the week for all occurrences of that day in a month
    /// </summary>
    public static List<int> GetLoyalCustomerIds(DateTime targetMonth)
    {
        var customers = DataService.ReadCustomersFromJson();
        var visitations = DataService.ReadVisitationsFromJson();

        var monthVisitations = visitations
            .Where(v => v.VisitDate.Year == targetMonth.Year && v.VisitDate.Month == targetMonth.Month)
            .ToList();

        return FindLoyalCustomersInVisitations(monthVisitations, targetMonth);
    }

    /// <summary>
    /// Finds all loyal customers across all months in the dataset
    /// Returns customers who were loyal in at least one month
    /// </summary>
    public static List<int> GetAllLoyalCustomerIds()
    {
        var visitations = DataService.ReadVisitationsFromJson();
        
        if (!visitations.Any())
            return new List<int>();

        // Group visitations by year-month
        var visitationsByMonth = visitations
            .GroupBy(v => new { v.VisitDate.Year, v.VisitDate.Month })
            .ToList();

        var allLoyalCustomers = new HashSet<int>();

        // Check each month independently
        foreach (var monthGroup in visitationsByMonth)
        {
            var targetMonth = new DateTime(monthGroup.Key.Year, monthGroup.Key.Month, 1);
            var loyalInMonth = FindLoyalCustomersInVisitations(monthGroup.ToList(), targetMonth);
            
            foreach (var customerId in loyalInMonth)
            {
                allLoyalCustomers.Add(customerId);
            }
        }

        return allLoyalCustomers.ToList();
    }

    /// <summary>
    /// Gets detailed loyalty information for all customers across all months
    /// Returns a dictionary with customer IDs and the months they were loyal
    /// </summary>
    public static Dictionary<int, List<DateTime>> GetLoyalCustomersByMonth()
    {
        var visitations = DataService.ReadVisitationsFromJson();
        
        if (!visitations.Any())
            return new Dictionary<int, List<DateTime>>();

        var visitationsByMonth = visitations
            .GroupBy(v => new { v.VisitDate.Year, v.VisitDate.Month })
            .ToList();

        var customerLoyaltyByMonth = new Dictionary<int, List<DateTime>>();

        foreach (var monthGroup in visitationsByMonth)
        {
            var targetMonth = new DateTime(monthGroup.Key.Year, monthGroup.Key.Month, 1);
            var loyalInMonth = FindLoyalCustomersInVisitations(monthGroup.ToList(), targetMonth);
            
            foreach (var customerId in loyalInMonth)
            {
                if (!customerLoyaltyByMonth.ContainsKey(customerId))
                {
                    customerLoyaltyByMonth[customerId] = new List<DateTime>();
                }
                customerLoyaltyByMonth[customerId].Add(targetMonth);
            }
        }

        return customerLoyaltyByMonth;
    }

    /// <summary>
    /// Helper method that contains the core loyalty detection logic
    /// </summary>
    private static List<int> FindLoyalCustomersInVisitations(List<Visitation> monthVisitations, DateTime targetMonth)
    {
        // group visitations by customer and hotel
        var customerHotelGroups = monthVisitations
            .GroupBy(v => new { v.CustomerId, v.HotelId })
            .ToList();

        var loyalCustomerIds = new HashSet<int>();
        var isCurrentMonth = targetMonth.Year == DateTime.Now.Year && targetMonth.Month == DateTime.Now.Month;
        var expectedDayOfWeekCounts = CalculateExpectedDayOfWeekCounts(targetMonth, isCurrentMonth);

        foreach (var group in customerHotelGroups)
        {
            // v1 - initially required week day visits >= 4 (actualCount >= 4)
            /*
            var visitsByDay = group
                .GroupBy(v => v.VisitDate.DayOfWeek) // Group visits by the day of the week
                .ToList();

            // Check if any day has 4 or more visits in the month
            foreach (var dayGroup in visitsByDay)
            {
                if (dayGroup.Count() >= 4) // Loyal customers should visit at least 4 times in a month on the same day
                {
                    loyalCustomerIds.Add(group.Key.CustomerId); // Add the customer ID to loyal list
                }
            }
            */

            // v2 - revised to match all occurrences of a day of week in month
            var visitDayOfWeekCounts = group
                .GroupBy(v => v.VisitDate.DayOfWeek)
                .ToDictionary(g => g.Key, g => g.Count());

            foreach (var kvp in expectedDayOfWeekCounts)
            {
                var dayOfWeek = kvp.Key;
                var expectedCount = kvp.Value;

                if (expectedCount > 0 &&
                    visitDayOfWeekCounts.TryGetValue(dayOfWeek, out int actualCount) &&
                    actualCount == expectedCount)
                {
                    loyalCustomerIds.Add(group.Key.CustomerId);
                    break; // check no further for this customer-hotel group
                }
            }
        }

        return loyalCustomerIds.ToList();
    }

    /// <summary>
    /// Helper method to calculate how many times each day of week occurs in a month
    /// For current month, counts only up to today
    /// For past/future months, counts the entire month
    /// </summary>
    private static Dictionary<DayOfWeek, int> CalculateExpectedDayOfWeekCounts(DateTime month, bool isCurrentMonth)
    {
        Dictionary<DayOfWeek, int> counts = new();
        int lastDay = isCurrentMonth ? DateTime.Now.Day : DateTime.DaysInMonth(month.Year, month.Month);

        var daysInMonth = Enumerable.Range(1, lastDay)
            .Select(d => new DateTime(month.Year, month.Month, d));

        counts = daysInMonth
            .GroupBy(d => d.DayOfWeek)
            .ToDictionary(g => g.Key, g => g.Count());

        // Ensure all days of week are in the dictionary (with 0 if not present)
        foreach (DayOfWeek day in Enum.GetValues(typeof(DayOfWeek)))
        {
            if (!counts.ContainsKey(day))
                counts[day] = 0;
        }

        return counts;
    }
}
